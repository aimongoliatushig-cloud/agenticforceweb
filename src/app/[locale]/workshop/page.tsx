import Link from "next/link";

const copy = {
  mn: {
    eyebrow: "Үнэгүй workshop",
    title: "Танай байгууллага AI company болох эхний алхам",
    subtitle:
      "Эрүүл мэнд болон үйлчилгээний байгууллагуудад зориулсан AI automation, AI agent, workflow сургалт.",
    dateLabel: "Хэзээ",
    priceLabel: "Төлбөр",
    price: "Үнэгүй",
    register: "Бүртгүүлэх",
    fullName: "Овог нэр",
    email: "Имэйл",
    phone: "Утас",
    company: "Байгууллага",
    jobTitle: "Албан тушаал",
    industry: "Салбар",
    companySize: "Байгууллагын хэмжээ",
    interest: "AI ашиглах сонирхол / асуудал",
    submit: "Workshop-д бүртгүүлэх",
    success: "Баярлалаа! Таны бүртгэлийг хүлээн авлаа.",
    error: "Алдаа гарлаа. Дахин оролдоно уу.",
    bullets: [
      "AI agent-уудыг хүний нөөц, CRM, бүртгэл, тайлан дээр ашиглах боломж",
      "Google Sheets, Gmail, Odoo/CRM зэрэг системүүдтэй AI automation холбох арга",
      "Байгууллага дээрээ эхлүүлж болох эхний 3–5 AI workflow-г тодорхойлох",
    ],
  },
  en: {
    eyebrow: "Free workshop",
    title: "The first step to becoming an AI company",
    subtitle:
      "A practical AI automation and AI agent workshop for healthcare and service organizations.",
    dateLabel: "Date",
    priceLabel: "Price",
    price: "Free",
    register: "Register",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    jobTitle: "Job title",
    industry: "Industry",
    companySize: "Company size",
    interest: "AI interest / pain point",
    submit: "Register for workshop",
    success: "Thank you! Your registration was received.",
    error: "Something went wrong. Please try again.",
    bullets: [
      "How AI agents can support HR, CRM, reporting, and operations",
      "Connecting AI automation with Google Sheets, Gmail, Odoo/CRM, and internal workflows",
      "Finding the first 3–5 AI workflows your company can start with",
    ],
  },
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function WorkshopPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === "mn" ? "mn" : "en";
  const t = copy[locale];
  const workshopDate = process.env.NEXT_PUBLIC_WORKSHOP_DATE || "2026-05-30";

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <Link href={`/${locale}`} className="text-sm text-amber-400 hover:text-amber-300">
          ← AgenticForce
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">{t.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">{t.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{t.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {t.dateLabel}: <strong>{workshopDate}</strong>
              </span>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-amber-200">
                {t.priceLabel}: <strong>{t.price}</strong>
              </span>
            </div>

            <div className="mt-10 space-y-4">
              {t.bullets.map((bullet) => (
                <div key={bullet} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/75">
                  {bullet}
                </div>
              ))}
            </div>
          </div>

          <WorkshopForm locale={locale} labels={t} workshopDate={workshopDate} />
        </div>
      </section>
    </main>
  );
}

function WorkshopForm({
  locale,
  labels,
  workshopDate,
}: {
  locale: "mn" | "en";
  labels: (typeof copy)["mn"];
  workshopDate: string;
}) {
  return (
    <form
      action="/api/workshop-signup"
      method="post"
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur md:p-8"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="workshopDate" value={workshopDate} />
      <input type="hidden" name="landingPage" value={`/${locale}/workshop`} />
      <h2 className="text-2xl font-semibold">{labels.register}</h2>

      <div className="mt-6 grid gap-4">
        <Field label={labels.fullName} name="fullName" required />
        <Field label={labels.email} name="email" type="email" required />
        <Field label={labels.phone} name="phone" required />
        <Field label={labels.company} name="company" required />
        <Field label={labels.jobTitle} name="jobTitle" />
        <Field label={labels.industry} name="industry" />
        <Field label={labels.companySize} name="companySize" />
        <label className="grid gap-2 text-sm text-white/72">
          {labels.interest}
          <textarea
            name="interest"
            rows={4}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-5 py-3 font-semibold text-black transition hover:scale-[1.01]"
      >
        {labels.submit}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-white/72">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-400"
      />
    </label>
  );
}
