import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Newspaper, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgenticWorkflowBackground } from "@/components/AgenticWorkflowBackground";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { AcademyEnrollmentForm } from "@/components/AcademyEnrollmentForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { QuoteForm } from "@/components/QuoteForm";
import { UserSync } from "@/components/UserSync";
import { academyTracks, articleExcerpt, articleTitle, localized, services } from "@/lib/content";
import { getPublishedArticles } from "@/lib/articles";
import { dictionary, normalizeLocale, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return {
    title:
      locale === "mn"
        ? "AgenticForce - Leading to agentic era"
        : "AgenticForce - Leading to agentic era",
    description:
      locale === "mn"
        ? "Agentic AI шийдэл, Agentic ERP, академи, AI мэдээ, CRM аналитик."
        : "Agentic AI solutions, Agentic ERP, academy training, AI news, CRM, and analytics.",
  };
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const copy = dictionary[locale];
  const articles = (await getPublishedArticles()).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      <AnalyticsTracker locale={locale} />
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <UserSync locale={locale} /> : null}
      <Hero locale={locale} />
      <Services locale={locale} />
      <Academy locale={locale} />
      <ArticlesPreview locale={locale} articles={articles} />
      <section id="request-quote" className="relative overflow-hidden bg-black py-20 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,.18),transparent_28%)]" />
        <div className="container relative mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              {locale === "mn" ? "Хамтран ажиллах" : "Work with us"}
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">{copy.quote.title}</h2>
            <p className="mt-4 max-w-xl text-white/68">{copy.quote.subtitle}</p>
            <div className="mt-8 grid gap-3 text-sm text-white/70">
              {[
                locale === "mn" ? "Процессын оношилгоо" : "Process discovery",
                locale === "mn" ? "Agentic ERP зураглал" : "Agentic ERP mapping",
                locale === "mn" ? "Академийн сургалтын санал" : "Academy training proposal",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-6">
            <QuoteForm locale={locale} />
          </div>
        </div>
      </section>
      <section id="newsletter" className="bg-zinc-950 py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-white/10 bg-black/40 p-6 sm:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">{copy.newsletter.title}</h2>
                <p className="mt-2 max-w-2xl text-white/65">{copy.newsletter.subtitle}</p>
              </div>
              <Newspaper className="hidden h-10 w-10 text-amber-300 md:block" />
            </div>
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const copy = dictionary[locale].hero;

  return (
    <section className="relative flex min-h-[94svh] items-center overflow-hidden bg-black pt-20">
      <AgenticWorkflowBackground />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.78),rgba(0,0,0,.18)_48%,rgba(0,0,0,.46)),linear-gradient(to_bottom,rgba(0,0,0,.06),#000_97%)]" />
      <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 py-14 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            {copy.badge}
          </div>
          <h1 className="max-w-full break-words text-4xl font-black leading-tight tracking-normal sm:max-w-4xl sm:text-7xl sm:leading-[0.95] lg:text-8xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{copy.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
              <Link href={`/${locale}#request-quote`}>
                {copy.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              <Link href={`/${locale}/articles`}>{copy.secondaryCta}</Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-sm text-white/70">
            {[copy.statOne, copy.statTwo, copy.statThree].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-4">
                <span className="font-semibold text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-dashboard-float relative min-h-[390px] overflow-visible sm:min-h-[470px] lg:min-h-[560px]">
          <div className="absolute inset-y-[10%] right-0 w-[92%] rounded-full bg-amber-500/10 blur-[90px]" />
          <div className="absolute inset-y-0 right-[-12px] w-[108%] [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_92%,transparent_100%)] sm:right-[-22px] lg:right-[-64px] lg:w-[118%]">
            <Image
              src="/images/agentic-command-layer.png"
              alt="AgenticForce command layer dashboard"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 92vw"
              className="object-contain object-right opacity-95 drop-shadow-[0_34px_90px_rgba(0,0,0,0.72)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ locale }: { locale: Locale }) {
  const copy = dictionary[locale].services;

  return (
    <section id="services" className="bg-black py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">{copy.title}</h2>
          <p className="mt-4 text-white/65">{copy.subtitle}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.titleEn} className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-colors hover:border-amber-400/45">
                <Icon className="h-8 w-8 text-amber-300" />
                <h3 className="mt-5 text-xl font-semibold">{localized(service, locale)}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {locale === "mn" ? service.descriptionMn : service.descriptionEn}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Academy({ locale }: { locale: Locale }) {
  const copy = dictionary[locale].academy;

  return (
    <section id="academy" className="bg-zinc-950 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              AgenticForce Academy
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">{copy.title}</h2>
            <p className="mt-4 text-white/65">{copy.subtitle}</p>
          </div>
          <div className="grid gap-4">
            {academyTracks.map((track, index) => (
              <article key={track.titleEn} className="rounded-lg border border-white/10 bg-black/40 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-amber-500 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{localized(track, locale)}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/62">
                      {locale === "mn" ? track.descriptionMn : track.descriptionEn}
                    </p>
                  </div>
                </div>
              </article>
            ))}
            <AcademyEnrollmentForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticlesPreview({
  locale,
  articles,
}: {
  locale: Locale;
  articles: Awaited<ReturnType<typeof getPublishedArticles>>;
}) {
  const copy = dictionary[locale].articles;

  return (
    <section id="articles" className="bg-black py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">{copy.title}</h2>
            <p className="mt-4 max-w-3xl text-white/65">{copy.subtitle}</p>
          </div>
          <Button asChild variant="outline" className="w-fit border-white/15 bg-white/5 text-white hover:bg-white/10">
            <Link href={`/${locale}/articles`}>{copy.viewAll}</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/${locale}/articles/${article.slug}`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-colors hover:border-amber-400/45"
            >
              <div className="relative h-44">
                <Image
                  src={article.coverImage || "/placeholder.jpg"}
                  alt={articleTitle(article, locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                  {article.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{articleTitle(article, locale)}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">
                  {articleExcerpt(article, locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
