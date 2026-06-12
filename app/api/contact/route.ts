import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form endpoint. Validates and accepts the submission.
 *
 * Delivery is intentionally pluggable: wire `deliver()` to your email
 * provider (Resend, SendGrid, AWS SES) or CRM webhook via environment
 * variables before production launch.
 */
async function deliver(payload: Record<string, string>) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "contact", ...payload }),
    });
  } else {
    console.log("[contact] submission received:", payload.subject, payload.email);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const company = String(body.company ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (name.length > 120 || email.length > 160 || message.length > 4000) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  try {
    await deliver({ name, email, subject, message, company, phone });
  } catch {
    return NextResponse.json(
      { error: "Unable to send your message right now. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
