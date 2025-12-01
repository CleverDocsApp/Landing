interface SendNotificationEmailParams {
  subject: string;
  summary: string;
  toEnvVar: string;
  fallbackTo: string;
  replyToEmail?: string;
  replyToName?: string;
}

export async function sendNotificationEmail({
  subject,
  summary,
  toEnvVar,
  fallbackTo,
  replyToEmail,
  replyToName
}: SendNotificationEmailParams): Promise<{ success: boolean; error?: string }> {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  if (!SENDGRID_API_KEY) {
    console.warn("[sendNotificationEmail] SENDGRID_API_KEY not configured; skipping email");
    return { success: false, error: "SENDGRID_API_KEY not configured" };
  }

  const fromAddress = process.env.EMAIL_FROM_ADDRESS || "no-reply@onklinic.com";
  const fromName = process.env.EMAIL_FROM_NAME || "OnKlinic Website";
  const toAddress = process.env[toEnvVar] || fallbackTo;

  const payload: any = {
    personalizations: [
      {
        to: [{ email: toAddress }],
        subject: subject
      }
    ],
    from: {
      email: fromAddress,
      name: fromName
    },
    content: [
      {
        type: "text/plain",
        value: summary
      }
    ]
  };

  if (replyToEmail && replyToName) {
    payload.reply_to = {
      email: replyToEmail,
      name: replyToName
    };
  }

  try {
    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error(`[sendNotificationEmail] SendGrid error ${resp.status}`, text);
      return { success: false, error: `SendGrid API returned ${resp.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error("[sendNotificationEmail] Error sending email", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
