import "server-only";
import {
  ACCEPTED_FILE_TYPES,
  type AcceptedFileType,
  FILE_LIMITS,
  formatBytes,
} from "./rules";

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((value, i) => bytes[offset + i] === value);

const ascii = (bytes: Uint8Array, start: number, end: number) =>
  String.fromCharCode(...bytes.subarray(start, end));

export const detectFileType = (bytes: Uint8Array): AcceptedFileType | null => {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return "image/png";
  if (ascii(bytes, 0, 6) === "GIF87a" || ascii(bytes, 0, 6) === "GIF89a")
    return "image/gif";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP")
    return "image/webp";
  if (ascii(bytes, 0, 5) === "%PDF-") return "application/pdf";
  if (ascii(bytes, 4, 8) === "ftyp") {
    const brand = ascii(bytes, 8, 12);
    if (["heic", "heix", "heim", "heis"].includes(brand)) return "image/heic";
    if (["mif1", "msf1", "heif"].includes(brand)) return "image/heif";
  }
  return null;
};

export const safeFilename = (name: string, type: AcceptedFileType) => {
  const extension = ACCEPTED_FILE_TYPES[type][0];
  const base =
    name
      .replace(/\.[^.]*$/, "")
      .normalize("NFKD")
      .replace(/[^\w\- ]+/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80) || "attachment";
  return `${base}${extension}`;
};

export type Attachment = {
  filename: string;
  contentType: AcceptedFileType;
  content: Buffer;
};

export type FileCheck =
  | { ok: true; attachments: Attachment[] }
  | { ok: false; error: string };

export const checkFiles = async (files: File[]): Promise<FileCheck> => {
  const present = files.filter((file) => file.size > 0);
  if (present.length > FILE_LIMITS.maxFiles)
    return {
      ok: false,
      error: `Attach up to ${FILE_LIMITS.maxFiles} files.`,
    };

  const total = present.reduce((sum, file) => sum + file.size, 0);
  if (total > FILE_LIMITS.maxTotalBytes)
    return {
      ok: false,
      error: `Files can add up to ${formatBytes(FILE_LIMITS.maxTotalBytes)} in total.`,
    };

  const attachments: Attachment[] = [];
  for (const file of present) {
    if (file.size > FILE_LIMITS.maxFileBytes)
      return {
        ok: false,
        error: `${file.name} is over ${formatBytes(FILE_LIMITS.maxFileBytes)}.`,
      };
    const content = Buffer.from(await file.arrayBuffer());
    const type = detectFileType(content);
    if (!type)
      return {
        ok: false,
        error: `${file.name} isn't a supported file. Send photos (JPG, PNG, WebP, GIF, HEIC) or a PDF.`,
      };
    attachments.push({
      filename: safeFilename(file.name, type),
      contentType: type,
      content,
    });
  }
  return { ok: true, attachments };
};
