import { ContactNotConfiguredError, sendEnquiry } from "@/lib/contact/email";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { checkFiles } from "@/lib/contact/files";
import { enquirySchema, FILE_LIMITS } from "@/lib/contact/rules";

const allowRequest = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 });
const MAX_BODY_BYTES = FILE_LIMITS.maxTotalBytes + 1024 * 1024;

const reply = (status: number, body: Record<string, unknown>, headers?: HeadersInit) =>
  Response.json(body, { status, headers });

const clientIp = (request: Request) =>
  request.headers.get("x-real-ip") ||
  request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
  "unknown";

const isSameOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return reply(403, { ok: false, error: "Send the form from the Metalhed site." });

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES)
    return reply(413, { ok: false, error: "Those files are too big to send together." });

  const limit = allowRequest(clientIp(request));
  if (!limit.allowed)
    return reply(
      429,
      { ok: false, error: "Too many messages in a short time. Try again in a few minutes." },
      { "Retry-After": String(limit.retryAfterSeconds) },
    );

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, { ok: false, error: "That didn't come through properly. Please try again." });
  }

  if (form.get("botcheck")) return reply(200, { ok: true });

  const parsed = enquirySchema.safeParse({
    name: form.get("name") ?? "",
    email: form.get("email") ?? "",
    enquiry: form.get("enquiry") ?? "",
    message: form.get("message") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      fieldErrors[field] ??= issue.message;
    }
    return reply(422, { ok: false, error: "Check the highlighted fields.", fieldErrors });
  }

  const files = form.getAll("files").filter((entry): entry is File => entry instanceof File);
  const fileCheck = await checkFiles(files);
  if (!fileCheck.ok)
    return reply(422, { ok: false, error: fileCheck.error, fieldErrors: { files: fileCheck.error } });

  try {
    await sendEnquiry(parsed.data, fileCheck.attachments);
  } catch (error) {
    console.error(
      error instanceof ContactNotConfiguredError ? "Contact form is not configured:" : "Contact form send failed:",
      error instanceof Error ? error.message : error,
    );
    return reply(502, { ok: false, error: "That didn't send." });
  }

  return reply(200, { ok: true });
}
