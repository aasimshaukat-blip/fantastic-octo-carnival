import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Careers application endpoint (multipart). Validates the application and
 * CV upload. Wire delivery to your ATS / email provider via
 * CAREERS_WEBHOOK_URL before production launch — CV files should be
 * forwarded to object storage or the ATS, never persisted on the web tier.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const position = String(form.get("position") ?? "").trim();
  const cover = String(form.get("cover") ?? "").trim();
  const cv = form.get("cv");

  if (!name || !email || !phone || !position) {
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
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Please attach your CV." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json(
      { error: "CV file must be smaller than 5 MB." },
      { status: 400 }
    );
  }
  if (cv.type && !ALLOWED_CV_TYPES.includes(cv.type)) {
    return NextResponse.json(
      { error: "CV must be a PDF or Word document." },
      { status: 400 }
    );
  }

  try {
    const webhook = process.env.CAREERS_WEBHOOK_URL;
    if (webhook) {
      const out = new FormData();
      out.set("type", "application");
      out.set("name", name);
      out.set("email", email);
      out.set("phone", phone);
      out.set("position", position);
      out.set("cover", cover);
      out.set("cv", cv, cv.name);
      await fetch(webhook, { method: "POST", body: out });
    } else {
      console.log("[careers] application received:", position, email, cv.name);
    }
  } catch {
    return NextResponse.json(
      { error: "Unable to submit right now. Please email your CV directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
