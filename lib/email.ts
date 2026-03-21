import type { EmailDeliveryResult } from "@/lib/types";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  return {
    apiKey,
    from
  };
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text
}: SendEmailInput): Promise<EmailDeliveryResult> {
  const { apiKey, from } = getEmailConfig();

  if (!apiKey || !from) {
    return {
      status: "skipped",
      message: "Email provider is not configured."
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text
      })
    });

    const data = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;

    if (!response.ok) {
      return {
        status: "failed",
        message: data?.message || "Email provider rejected the request."
      };
    }

    return {
      status: "sent",
      message: "Email sent successfully.",
      providerId: data?.id
    };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "Unknown email error."
    };
  }
}
