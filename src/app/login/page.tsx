"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/Providers";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, locale, setLocale } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(params.get("next") || "/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500 text-2xl font-black text-brand-900 shadow-lg">
            ACE
          </div>
          <h1 className="text-2xl font-bold text-white">{t("appName")}</h1>
          <p className="mt-1 text-sm text-slate-300">{t("appTagline")}</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("welcomeBack")}</h2>
          <p className="text-sm text-slate-500">{t("signInPrompt")}</p>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">{t("email")}</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@acecontracting.ae"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t("password")}</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "…" : t("login")}
          </button>

          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600"
          >
            {locale === "en" ? "العربية" : "English"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo: admin@acecontracting.ae / Admin@1234
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
