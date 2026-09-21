import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "DSH Nature <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "dshnature@gmail.com";

/**
 * Best-effort notification — never throws, so a Resend outage or missing
 * RESEND_API_KEY never fails the form submission that triggered it.
 */
export async function sendAdminNotification({
  subject,
  text,
}: {
  subject: string;
  text: string;
}): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY chưa được cấu hình — bỏ qua gửi email thông báo:", subject);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      text,
    });
  } catch (err) {
    console.error("[email] Gửi email thông báo thất bại:", err);
  }
}
