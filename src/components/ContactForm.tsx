"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { site } from "@/content/site";
import {
  ACCEPT_ATTRIBUTE,
  ACCEPTED_FILE_TYPES,
  ENQUIRY_TYPES,
  enquirySchema,
  FILE_LIMITS,
  formatBytes,
} from "@/lib/contact/rules";

type Field = "name" | "email" | "message" | "files";
type Errors = Partial<Record<Field, string>>;

const SENT = "Message sent. Thanks — I'll get back to you soon.";
const FAILED = `That didn't send. Please try again, or email ${site.email} directly.`;
const ACCEPTED_EXTENSIONS = Object.values(ACCEPTED_FILE_TYPES).flat() as string[];

const looksAccepted = (file: File) =>
  file.type in ACCEPTED_FILE_TYPES ||
  ACCEPTED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension));

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [dragging, setDragging] = useState(false);

  const announce = (text: string) => {
    setStatus(text);
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const next = [...files];
    const problems: string[] = [];
    for (const file of incoming) {
      if (next.some((existing) => fileKey(existing) === fileKey(file))) continue;
      if (!looksAccepted(file)) problems.push(`${file.name} isn't a photo or PDF.`);
      else if (file.size > FILE_LIMITS.maxFileBytes)
        problems.push(`${file.name} is over ${formatBytes(FILE_LIMITS.maxFileBytes)}.`);
      else if (next.length >= FILE_LIMITS.maxFiles)
        problems.push(`You can attach up to ${FILE_LIMITS.maxFiles} files.`);
      else next.push(file);
    }
    const total = next.reduce((sum, file) => sum + file.size, 0);
    if (total > FILE_LIMITS.maxTotalBytes) {
      problems.push(`Files can add up to ${formatBytes(FILE_LIMITS.maxTotalBytes)} in total.`);
      return setErrors((current) => ({ ...current, files: problems.join(" ") }));
    }
    setFiles(next);
    setErrors((current) => ({ ...current, files: problems.join(" ") || undefined }));
  };

  const removeFile = (key: string) => {
    setFiles((current) => current.filter((file) => fileKey(file) !== key));
    setErrors((current) => ({ ...current, files: undefined }));
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const validate = (form: HTMLFormElement): Errors => {
    const data = new FormData(form);
    const result = enquirySchema.safeParse({
      name: data.get("name") ?? "",
      email: data.get("email") ?? "",
      enquiry: data.get("enquiry") ?? "",
      message: data.get("message") ?? "",
    });
    if (result.success) return {};
    const found: Errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as Field;
      found[field] ??= issue.message;
    }
    return found;
  };

  const onBlur = (field: Field) => {
    if (!formRef.current || errors[field] === undefined) return;
    setErrors((current) => ({ ...current, [field]: validate(formRef.current!)[field] }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validate(form);
    if (Object.keys(found).length) {
      setErrors((current) => ({ ...found, files: current.files }));
      const first = (["name", "email", "message"] as const).find((field) => found[field]);
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setSending(true);
    setStatus("");
    const body = new FormData(form);
    body.delete("files");
    for (const file of files) body.append("files", file, file.name);

    try {
      const response = await fetch("/api/contact", { method: "POST", body });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Errors;
      };
      if (response.ok && data.ok) {
        form.reset();
        setFiles([]);
        setErrors({});
        announce(SENT);
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      announce(
        response.status === 502 || !data.error ? FAILED : `${data.error} ${response.status === 429 ? "" : "Nothing was sent."}`.trim(),
      );
    } catch {
      announce(FAILED);
    } finally {
      setSending(false);
    }
  };

  const describedBy = (field: Field, hint?: string) =>
    [hint, errors[field] ? `contact-${field}-error` : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <form ref={formRef} className="contact-form" noValidate onSubmit={onSubmit}>
      <div className="contact-form-bar" aria-hidden="true">
        <span>Commission enquiry</span>
        <span>{"// Form 05"}</span>
      </div>
      <input
        type="checkbox"
        className="honeypot"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="field-row">
        <div className="field">
          <label htmlFor="contact-name">Name</label>
          <input
            type="text"
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            onBlur={() => onBlur("name")}
          />
          <p className="field-error" id="contact-name-error">
            {errors.name}
          </p>
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            type="email"
            id="contact-email"
            name="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            onBlur={() => onBlur("email")}
          />
          <p className="field-error" id="contact-email-error">
            {errors.email}
          </p>
        </div>
      </div>

      <fieldset className="field choice">
        <legend>What are you after?</legend>
        <div className="choice-options">
          {ENQUIRY_TYPES.map((type, index) => (
            <label className="chip" key={type}>
              <input type="radio" name="enquiry" value={type} defaultChecked={index === 0} />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="contact-message">Tell me about it</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", "contact-message-hint")}
          onBlur={() => onBlur("message")}
        />
        <p className="field-hint" id="contact-message-hint">
          The character or pet, the scale and when you&apos;d like it by.
        </p>
        <p className="field-error" id="contact-message-error">
          {errors.message}
        </p>
      </div>

      <div className="field">
        <label htmlFor="contact-files">Reference photos (optional)</label>
        <div
          className={`file-drop${dragging ? " dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input
            type="file"
            id="contact-files"
            name="files"
            multiple
            accept={ACCEPT_ATTRIBUTE}
            aria-describedby={describedBy("files", "contact-files-hint")}
            onChange={(event) => {
              addFiles(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
          />
          <span className="file-drop-title">Drop files here or choose them</span>
          <span id="contact-files-hint">
            Up to {FILE_LIMITS.maxFiles} photos or PDFs, {formatBytes(FILE_LIMITS.maxFileBytes)}{" "}
            each and {formatBytes(FILE_LIMITS.maxTotalBytes)} in total.
          </span>
        </div>
        {files.length > 0 && (
          <ul className="file-list" aria-label="Attached files">
            {files.map((file) => (
              <li key={fileKey(file)}>
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  className="file-remove"
                  onClick={() => removeFile(fileKey(file))}
                >
                  Remove<span className="visually-hidden"> {file.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="field-error" id="contact-files-error" role="alert">
          {errors.files}
        </p>
      </div>

      <div className="form-foot">
        <button className="cta" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send it ↗"}
        </button>
        <p className="form-note">
          Goes straight to the Metalhed inbox. Your details and files are only used to reply to
          you.
        </p>
      </div>
      <p className="form-status" ref={statusRef} role="status" tabIndex={-1}>
        {status}
      </p>
    </form>
  );
}
