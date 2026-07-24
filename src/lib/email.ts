import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Author";

export async function sendPurchaseEmail({
  to,
  customerName,
  bookTitle,
  downloadUrl,
}: {
  to: string;
  customerName?: string;
  bookTitle: string;
  downloadUrl: string;
}) {
  const greeting = customerName ? `Hi ${customerName},` : "Hi,";

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: `Your download: ${bookTitle}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #241e1a;">
        <p style="font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: #8a7d70; margin: 0 0 24px;">${SITE_NAME}</p>
        <p style="font-size: 16px; line-height: 1.6;">${greeting}</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for purchasing <strong>${bookTitle}</strong>. Your download is ready.
        </p>
        <p style="margin: 32px 0;">
          <a href="${downloadUrl}" style="background: #b5502e; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; display: inline-block;">
            Download ${bookTitle}
          </a>
        </p>
        <p style="font-size: 13px; color: #8a7d70; line-height: 1.6;">
          This link expires in 2 hours. If it's expired by the time you read this,
          just reply to this email and we'll send a new one.
        </p>
      </div>
    `,
  });

  if (result.error) {
    console.error("[sendPurchaseEmail] Resend rejected the send:", result.error);
    throw new Error(`Resend error: ${result.error.message || JSON.stringify(result.error)}`);
  }

  return result;
}

export async function sendContactReplyEmail({
  to,
  customerName,
  subject,
  replyBody,
}: {
  to: string;
  customerName?: string;
  subject?: string;
  replyBody: string;
}) {
  const greeting = customerName ? `Hi ${customerName},` : "Hi,";
  // Preserve the sender's line breaks without letting raw HTML through.
  const escapedBody = replyBody
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: subject ? `Re: ${subject}` : `A reply from ${SITE_NAME}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #241e1a;">
        <p style="font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: #8a7d70; margin: 0 0 24px;">${SITE_NAME}</p>
        <p style="font-size: 16px; line-height: 1.6;">${greeting}</p>
        <p style="font-size: 16px; line-height: 1.7;">${escapedBody}</p>
        <p style="margin-top: 32px; font-size: 13px; color: #8a7d70; line-height: 1.6;">
          You're receiving this because you reached out through the contact form on
          our website. Reply directly to this email to continue the conversation.
        </p>
      </div>
    `,
  });

  if (result.error) {
    console.error("[sendContactReplyEmail] Resend rejected the send:", result.error);
    throw new Error(`Resend error: ${result.error.message || JSON.stringify(result.error)}`);
  }

  return result;
}
