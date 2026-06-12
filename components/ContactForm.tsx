"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded border border-steel-300 bg-white px-4 py-3 text-sm text-steel-800 placeholder:text-steel-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" aria-hidden />
        <h3 className="mt-4 text-xl font-bold text-navy-900">
          Message received
        </h3>
        <p className="mt-2 max-w-sm text-sm text-steel-600">
          Thank you for contacting ACE Contracting. Our team will respond
          within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-accent-600 hover:text-accent-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Full Name *
          </label>
          <input id="name" name="name" required maxLength={120} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Company
          </label>
          <input id="company" name="company" maxLength={120} placeholder="Company name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Email *
          </label>
          <input id="email" name="email" type="email" required maxLength={160} placeholder="you@company.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" maxLength={32} placeholder="+971 ..." className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-navy-900">
          Subject *
        </label>
        <select id="subject" name="subject" required className={inputClass} defaultValue="">
          <option value="" disabled>
            Select a subject
          </option>
          <option>Project Enquiry / RFP</option>
          <option>Pre-Qualification Request</option>
          <option>Vendor / Subcontractor Registration</option>
          <option>Careers</option>
          <option>General Enquiry</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-navy-900">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder="Tell us about your project or enquiry..."
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 rounded bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded bg-accent-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
