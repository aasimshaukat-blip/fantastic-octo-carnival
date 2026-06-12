import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-40 text-center sm:px-6">
        <p className="text-7xl font-extrabold text-accent-500">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-white">
          Page Not Found
        </h1>
        <p className="mt-4 text-steel-300">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
