import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { news, getPost } from "@/lib/data/news";
import { company } from "@/lib/data/company";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${company.url}/news/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = news.filter((n) => n.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.title,
          datePublished: post.date,
          description: post.excerpt,
          publisher: { "@type": "Organization", name: company.legalName },
        }}
      />

      <section className="relative overflow-hidden pb-16 pt-40">
        <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`} aria-hidden />
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-navy-950/50" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-accent-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All News
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/80">
              <CalendarDays className="h-4 w-4" aria-hidden />
              {formatDate(post.date)}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
        </div>
      </section>

      <article className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-lg font-medium leading-relaxed text-navy-800">
              {post.excerpt}
            </p>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-steel-700">
              {post.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </article>

      <section className="bg-steel-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-navy-900">More News</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((n) => (
              <Link
                key={n.slug}
                href={`/news/${n.slug}`}
                className="group rounded-xl border border-steel-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-accent-600">
                  {n.category}
                </p>
                <h3 className="mt-2 font-bold leading-snug text-navy-900 transition-colors group-hover:text-accent-600">
                  {n.title}
                </h3>
                <p className="mt-2 text-xs text-steel-500">{formatDate(n.date)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
