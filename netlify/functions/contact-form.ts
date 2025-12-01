import type { Context } from "@netlify/functions";
import { saveContactFormSubmission } from "../lib/okhowtoStore";
import { sendNotificationEmail } from "../lib/emailNotifications";
import { corsHeaders, preflight } from "./utils/cors";

export default async (req: Request, context: Context) => {
  const preflightRes = preflight(req);
  if (preflightRes) return preflightRes;

  const origin = req.headers.get("Origin");
  const headers = corsHeaders(origin);

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const { name, email, organization, role, interest, message, source, pagePath, userAgent } = body;

    if (!name || !email || !role || !interest || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    let savedContact;
    try {
      savedContact = await saveContactFormSubmission({
        source: source || "chat-with-our-team-pricing-teaser",
        name,
        email,
        organization: organization || undefined,
        role,
        interest,
        message,
        pagePath: pagePath || undefined,
        userAgent: userAgent || undefined,
        locale: undefined
      });
      console.log('[contact-form] Contact form submission saved:', savedContact.id);
    } catch (saveErr) {
      console.error('[contact-form] Failed to save submission to blobs:', saveErr);
      return new Response(JSON.stringify({ error: "Failed to save submission. Please try again." }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    const emailSummary = [
      "New OnKlinic contact via Chat with us",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      organization ? `Organization: ${organization}` : "",
      `Role: ${role}`,
      `Interest: ${interest}`,
      pagePath ? `Page Path: ${pagePath}` : "",
      "",
      "Message:",
      message
    ].filter(Boolean).join("\n");

    const DEMO_REQUEST_TO = process.env.DEMO_REQUEST_TO || "demos@onklinic.com";
    const emailResult = await sendNotificationEmail({
      subject: "New OnKlinic contact via Chat with us",
      summary: emailSummary,
      toEnvVar: "CONTACT_FORM_TO",
      fallbackTo: DEMO_REQUEST_TO,
      replyToEmail: email,
      replyToName: name
    });

    if (!emailResult.success) {
      console.error('[contact-form] Email notification failed:', emailResult.error);
    }

    return new Response(JSON.stringify({
      success: true,
      id: savedContact.id
    }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error('[contact-form] Unexpected error:', err);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};
