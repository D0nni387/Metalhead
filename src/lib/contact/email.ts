import "server-only";
import { Resend } from "resend";
import { site } from "@/content/site";
import type { Attachment } from "./files";
import { type Enquiry, formatBytes } from "./rules";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const buildEnquiryEmail = (
  enquiry: Enquiry,
  attachments: Attachment[],
) => {
  const subject = `New ${enquiry.enquiry.toLowerCase()} enquiry from ${enquiry.name}`.slice(
    0,
    150,
  );
  const fileLines = attachments.map(
    (file) => `${file.filename} (${formatBytes(file.content.length)})`,
  );

  const text = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Enquiry: ${enquiry.enquiry}`,
    "",
    enquiry.message,
    "",
    fileLines.length
      ? `Attached files:\n${fileLines.map((line) => `- ${line}`).join("\n")}`
      : "No files attached.",
    "",
    `Reply to this email to answer ${enquiry.name} directly.`,
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${label}</td><td style="padding:4px 0">${value}</td></tr>`;

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">
<h2 style="margin:0 0 12px">New enquiry from the ${site.name} site</h2>
<table style="border-collapse:collapse">
${row("Name", escapeHtml(enquiry.name))}
${row("Email", `<a href="mailto:${escapeHtml(enquiry.email)}">${escapeHtml(enquiry.email)}</a>`)}
${row("Enquiry", escapeHtml(enquiry.enquiry))}
</table>
<p style="white-space:pre-wrap;margin:16px 0;padding:12px;background:#f5f5f5;border-radius:6px">${escapeHtml(enquiry.message)}</p>
<p style="margin:0 0 4px"><strong>${fileLines.length ? "Attached files" : "No files attached."}</strong></p>
${fileLines.length ? `<ul style="margin:0;padding-left:20px">${fileLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` : ""}
<p style="color:#666;margin-top:16px">Reply to this email to answer ${escapeHtml(enquiry.name)} directly.</p>
</div>`;

  return { subject, text, html };
};

export class ContactNotConfiguredError extends Error {}

export const sendEnquiry = async (
  enquiry: Enquiry,
  attachments: Attachment[],
) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  if (!apiKey || !from)
    throw new ContactNotConfiguredError(
      "RESEND_API_KEY and CONTACT_FROM_EMAIL must be set",
    );

  const { subject, text, html } = buildEnquiryEmail(enquiry, attachments);
  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: `${enquiry.name.replace(/[<>",]/g, "")} <${enquiry.email}>`,
    subject,
    text,
    html,
    attachments: attachments.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: file.contentType,
    })),
  });
  if (error) throw new Error(`Resend rejected the enquiry: ${error.message}`);
};
