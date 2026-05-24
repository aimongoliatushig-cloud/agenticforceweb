import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function WorkshopThankYouPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === "mn" ? "mn" : "en";
  const isMn = locale === "mn";

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="container mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          {isMn ? "Бүртгэл амжилттай" : "Registration received"}
        </p>
        <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
          {isMn ? "Баярлалаа!" : "Thank you!"}
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          {isMn
            ? "Таны workshop бүртгэлийг хүлээн авлаа. Бид баталгаажуулалт болон дэлгэрэнгүй мэдээллийг удахгүй илгээнэ."
            : "Your workshop registration has been received. We will send confirmation and details shortly."}
        </p>
        <Link
          href={`/${locale}`}
          className="mt-8 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 font-semibold text-black"
        >
          {isMn ? "Нүүр хуудас руу буцах" : "Back to homepage"}
        </Link>
      </section>
    </main>
  );
}
