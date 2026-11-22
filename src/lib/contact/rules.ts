import { z } from "zod";

export const ENQUIRY_TYPES = [
  "Pet statue",
  "Collectible painting",
  "Something else",
] as const;

export const FILE_LIMITS = {
  maxFiles: 5,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
} as const;

export const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/heic": [".heic"],
  "image/heif": [".heif"],
  "application/pdf": [".pdf"],
} as const;

export type AcceptedFileType = keyof typeof ACCEPTED_FILE_TYPES;

export const ACCEPT_ATTRIBUTE = Object.entries(ACCEPTED_FILE_TYPES)
  .flatMap(([mime, extensions]) => [mime, ...extensions])
  .join(",");

export const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${Number((bytes / (1024 * 1024)).toFixed(1))} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Add your name so I know who to reply to.")
    .max(120, "Keep your name under 120 characters."),
  email: z
    .string()
    .trim()
    .max(254, "That email address is too long.")
    .pipe(
      z.email("Add an email address I can reply to, like name@example.com."),
    ),
  enquiry: z.enum(ENQUIRY_TYPES).catch("Something else"),
  message: z
    .string()
    .trim()
    .min(1, "Tell me a little about what you have in mind.")
    .max(5000, "Keep the message under 5,000 characters."),
});

export type Enquiry = z.infer<typeof enquirySchema>;
