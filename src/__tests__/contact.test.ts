import { describe, expect, it } from "vitest";
import { buildEnquiryEmail } from "@/lib/contact/email";
import { checkFiles, detectFileType, safeFilename } from "@/lib/contact/files";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { enquirySchema, FILE_LIMITS } from "@/lib/contact/rules";

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const bytes = (...parts: (number[] | string)[]) =>
  new Uint8Array(parts.flatMap((part) => (typeof part === "string" ? [...part].map((c) => c.charCodeAt(0)) : part)));
const file = (name: string, content: Uint8Array<ArrayBuffer>, type = "") => new File([content], name, { type });

describe("enquirySchema", () => {
  it("accepts a valid enquiry and trims it", () => {
    const result = enquirySchema.parse({
      name: "  Sam ",
      email: "sam@example.com",
      enquiry: "Pet statue",
      message: " A statue of my dog ",
    });
    expect(result).toEqual({ name: "Sam", email: "sam@example.com", enquiry: "Pet statue", message: "A statue of my dog" });
  });

  it("falls back to 'Something else' for an unknown enquiry type", () => {
    const result = enquirySchema.parse({ name: "Sam", email: "sam@example.com", enquiry: "Hacked", message: "Hi" });
    expect(result.enquiry).toBe("Something else");
  });

  it("reports each missing field", () => {
    const result = enquirySchema.safeParse({ name: " ", email: "nope", enquiry: "", message: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(["name", "email", "message"]);
  });
});

describe("detectFileType", () => {
  it.each([
    ["image/jpeg", bytes([0xff, 0xd8, 0xff, 0xe0])],
    ["image/png", bytes(PNG)],
    ["image/gif", bytes("GIF89a")],
    ["image/webp", bytes("RIFF", [0, 0, 0, 0], "WEBP")],
    ["application/pdf", bytes("%PDF-1.7")],
    ["image/heic", bytes([0, 0, 0, 24], "ftypheic")],
    ["image/heif", bytes([0, 0, 0, 24], "ftypmif1")],
  ])("recognises %s from its bytes", (type, content) => {
    expect(detectFileType(content)).toBe(type);
  });

  it("rejects anything else, whatever it claims to be", () => {
    expect(detectFileType(bytes("<html><script>"))).toBeNull();
    expect(detectFileType(bytes("MZ", [0x90, 0]))).toBeNull();
  });
});

describe("safeFilename", () => {
  it("strips paths and odd characters and uses the detected extension", () => {
    expect(safeFilename("../../etc/My Dog!!.exe", "image/png")).toBe("etcMy-Dog.png");
    expect(safeFilename("???", "application/pdf")).toBe("attachment.pdf");
  });
});

describe("checkFiles", () => {
  it("accepts real images and ignores empty inputs", async () => {
    const result = await checkFiles([file("dog.png", bytes(PNG)), file("", new Uint8Array())]);
    expect(result.ok && result.attachments.map((a) => [a.filename, a.contentType])).toEqual([["dog.png", "image/png"]]);
  });

  it("rejects a renamed executable", async () => {
    const result = await checkFiles([file("photo.jpg", bytes("MZ", [0x90, 0]), "image/jpeg")]);
    expect(result).toEqual({ ok: false, error: expect.stringContaining("isn't a supported file") });
  });

  it("enforces the file count", async () => {
    const many = Array.from({ length: FILE_LIMITS.maxFiles + 1 }, (_, i) => file(`${i}.png`, bytes(PNG)));
    expect((await checkFiles(many)).ok).toBe(false);
  });

  it("enforces the per-file size", async () => {
    const big = new Uint8Array(FILE_LIMITS.maxFileBytes + 1);
    big.set(PNG);
    expect(await checkFiles([file("big.png", big)])).toEqual({ ok: false, error: expect.stringContaining("is over") });
  });
});

describe("createRateLimiter", () => {
  it("blocks after the limit and resets after the window", () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(allow("ip", 0).allowed).toBe(true);
    expect(allow("ip", 10).allowed).toBe(true);
    expect(allow("ip", 20)).toEqual({ allowed: false, retryAfterSeconds: 1 });
    expect(allow("other", 20).allowed).toBe(true);
    expect(allow("ip", 1000).allowed).toBe(true);
  });
});

describe("buildEnquiryEmail", () => {
  it("escapes user input in the HTML body", () => {
    const { html, text, subject } = buildEnquiryEmail(
      { name: "<b>Sam</b>", email: "sam@example.com", enquiry: "Pet statue", message: "<script>x</script>" },
      [],
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(text).toContain("<script>x</script>");
    expect(subject).toBe("New pet statue enquiry from <b>Sam</b>");
  });
});
