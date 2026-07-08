// =============================================================
// RetailConnect SIP — Email utility (Resend)
// -------------------------------------------------------------
// The reusable primitive for ALL transactional email. `sendEmail` is a
// thin Resend wrapper; `emailLayout` gives every message a branded,
// email-client-safe (table + inline-styles) shell. Reads RESEND_API_KEY
// and EMAIL_FROM from the environment. Server-only (never import into a
// client component).
// =============================================================

import { Resend } from "resend";

const BRAND = {
  name: "RetailConnect SIP",
  primary: "#1f53e5",
  ink: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  bg: "#f1f5f9",
  surface: "#ffffff",
};

let _client = null;
function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set in the environment.");
  if (!_client) _client = new Resend(key);
  return _client;
}

/**
 * Send an email via Resend. Returns Resend's response data ({ id }).
 * Throws on missing config or a provider error.
 */
export async function sendEmail({ to, subject, html, text, from, replyTo }) {
  if (!to) throw new Error("sendEmail: `to` is required.");
  if (!subject) throw new Error("sendEmail: `subject` is required.");
  if (!html && !text) throw new Error("sendEmail: `html` or `text` is required.");

  const sender = from || process.env.EMAIL_FROM;
  if (!sender) throw new Error("EMAIL_FROM is not set in the environment.");

  const { data, error } = await client().emails.send({
    from: sender,
    to,
    subject,
    html,
    text,
    replyTo,
  });

  if (error) {
    throw new Error(error.message || "Email failed to send.");
  }
  return data;
}

/**
 * Wrap body HTML in the branded, responsive email shell.
 *  title:       shown as the H1 inside the card
 *  previewText: inbox preview snippet (hidden in the body)
 *  bodyHtml:    the message content (paragraphs, buttons…)
 */
export function emailLayout({ title, previewText = "", bodyHtml = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(
      previewText
    )}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${
      BRAND.bg
    };padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
            <tr>
              <td style="padding:4px 8px 20px;">
                <span style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:${
                  BRAND.ink
                };letter-spacing:-0.02em;">
                  RetailConnect
                  <span style="display:inline-block;margin-left:6px;padding:2px 7px;border-radius:5px;background:#e8edfd;color:${
                    BRAND.primary
                  };font-size:11px;font-weight:700;vertical-align:middle;">SIP</span>
                </span>
              </td>
            </tr>
            <tr>
              <td style="background:${
                BRAND.surface
              };border:1px solid ${BRAND.border};border-radius:16px;padding:36px 32px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;font-weight:700;color:${
                  BRAND.ink
                };letter-spacing:-0.02em;">${escapeHtml(title)}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 8px 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${
                BRAND.muted
              };">
                RetailConnect SIP — field sales &amp; distribution.<br />
                This is an automated message; please don't reply.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Cobalt CTA button (bulletproof-ish for email clients). */
export function emailButton(label, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
    <tr>
      <td align="center" style="border-radius:10px;background:${BRAND.primary};">
        <a href="${escapeAttr(url)}" target="_blank"
           style="display:inline-block;padding:13px 26px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}

/**
 * Compose + send the password-reset email.
 */
export async function sendPasswordResetEmail({ to, name, resetUrl, ttlMinutes = 60 }) {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi there,";
  const p = (html) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">${html}</p>`;

  const bodyHtml = `
    ${p(greeting)}
    ${p(
      "We received a request to reset the password for your RetailConnect SIP account. Click the button below to choose a new one."
    )}
    ${emailButton("Reset password", resetUrl)}
    ${p(
      `This link expires in <strong>${ttlMinutes} minutes</strong> and can be used once. If you didn't request a reset, you can safely ignore this email — your password won't change.`
    )}
    <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#94a3b8;word-break:break-all;">
      If the button doesn't work, paste this link into your browser:<br />
      <a href="${escapeAttr(resetUrl)}" style="color:${BRAND.primary};">${escapeHtml(
    resetUrl
  )}</a>
    </p>`;

  const html = emailLayout({
    title: "Reset your password",
    previewText: "Reset your RetailConnect SIP password — link expires in 60 minutes.",
    bodyHtml,
  });

  const text = `${name ? `Hi ${name},` : "Hi there,"}

We received a request to reset your RetailConnect SIP password.
Reset it here: ${resetUrl}

This link expires in ${ttlMinutes} minutes and can be used once.
If you didn't request this, ignore this email — your password won't change.`;

  return sendEmail({
    to,
    subject: "Reset your RetailConnect password",
    html,
    text,
  });
}

// ---- small escapers so composed values can't break the markup ----
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(str = "") {
  return escapeHtml(str).replace(/'/g, "&#39;");
}
