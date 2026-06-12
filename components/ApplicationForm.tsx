"use client";

import { useState, type FormEvent } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { jobs } from "@/lib/data/jobs";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded border border-steel-300 bg-white px-4 py-3 text-sm text-steel-800 placeholder:text-steel-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30";

const MAX_CV_MB = 5;

export default function ApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const cv = data.get("cv");
    if (cv instanceof File && cv.size > MAX_CV_MB * 1024 * 1024) {
      setStatus("error");
      setError(`CV file must be smaller than ${MAX_CV_MB} MB.`);
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/careers", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
      setFileName("");
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
          Application submitted
        </h3>
        <p className="mt-2 max-w-sm text-sm text-steel-600">
          Thank you for your interest in ACE Contracting. Our HR team reviews
          every application and will be in touch if there is a match.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-accent-600 hover:text-accent-700"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="app-name" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Full Name *
          </label>
          <input id="app-name" name="name" required maxLength={120} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-email" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Email *
          </label>
          <input id="app-email" name="email" type="email" required maxLength={160} placeholder="you@email.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Phone *
          </label>
          <input id="app-phone" name="phone" type="tel" required maxLength={32} placeholder="+971 ..." className={inputClass} />
        </div>
        <div>
          <label htmlFor="app-position" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Position *
          </label>
          <select id="app-position" name="position" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a position
            </option>
            {jobs.map((j) => (
              <option key={j.slug} value={j.title}>
                {j.title}
              </option>
            ))}
            <option value="General Application">General Application</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="app-cover" className="mb-1.5 block text-sm font-semibold text-navy-900">
          Cover Note
        </label>
        <textarea
          id="app-cover"
          name="cover"
          rows={4}
          maxLength={2000}
          placeholder="Briefly tell us about your experience..."
          className={inputClass}
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-navy-900">
          CV / Resume * <span className="font-normal text-steel-500">(PDF or Word, max {MAX_CV_MB} MB)</span>
        </span>
        <label
          htmlFor="app-cv"
          className="flex cursor-pointer items-center justify-center gap-3 rounded border-2 border-dashed border-steel-300 bg-steel-50 px-4 py-8 text-sm text-steel-600 transition-colors hover:border-accent-400 hover:bg-accent-50"
        >
          <Upload className="h-5 w-5 text-accent-500" aria-hidden />
          {fileName || "Click to upload your CV"}
        </label>
        <input
          id="app-cv"
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
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
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
