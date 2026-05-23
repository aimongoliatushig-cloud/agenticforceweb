"use client";

import { useMemo, useState } from "react";
import { Show, SignUpButton, useUser } from "@clerk/nextjs";
import { GraduationCap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

const courses = [
  {
    id: "agentic-ai-professional",
    nameEn: "Agentic AI Professional",
    nameMn: "Agentic AI Professional",
    plan: "Professional cohort",
    price: "0",
    currency: "MNT",
  },
  {
    id: "ai-agent-builder",
    nameEn: "AI Agent Builder",
    nameMn: "AI Agent Builder",
    plan: "Builder cohort",
    price: "0",
    currency: "MNT",
  },
  {
    id: "agentic-erp-operator",
    nameEn: "Agentic ERP Operator",
    nameMn: "Agentic ERP Operator",
    plan: "ERP operator cohort",
    price: "0",
    currency: "MNT",
  },
];

export function AcademyEnrollmentForm({ locale }: { locale: Locale }) {
  const { user } = useUser();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const labels = useMemo(
    () =>
      locale === "mn"
        ? {
            title: "Академид бүртгүүлэх",
            subtitle: "Clerk бүртгэлээр нэвтэрсний дараа нэмэлт мэдээллээ илгээнэ үү.",
            signUp: "Эхлээд үнэгүй бүртгүүлэх",
            phone: "Утасны дугаар",
            country: "Улс",
            city: "Хот",
            currentWork: "Одоогийн ажил / үүрэг",
            course: "Сургалтын чиглэл",
            submit: "Академид бүртгүүлэх",
            success: "Бүртгэл амжилттай. Hermes Agent руу lead илгээгдлээ.",
            error: "Бүртгэл илгээхэд алдаа гарлаа.",
          }
        : {
            title: "Enroll in the academy",
            subtitle: "Sign up with Clerk, then send your enrollment details to our academy team.",
            signUp: "Sign up free first",
            phone: "Phone number",
            country: "Country",
            city: "City",
            currentWork: "Current work / role",
            course: "Academy track",
            submit: "Enroll in academy",
            success: "Enrollment saved. Lead sent to Hermes Agent.",
            error: "Enrollment failed. Try again.",
          },
    [locale]
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const courseId = String(formData.get("courseId"));
    const course = courses.find((item) => item.id === courseId) ?? courses[0];
    const searchParams = new URLSearchParams(window.location.search);

    const response = await fetch("/api/academy/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: formData.get("phone"),
        country: formData.get("country"),
        city: formData.get("city"),
        currentWork: formData.get("currentWork"),
        courseId: course.id,
        courseName: locale === "mn" ? course.nameMn : course.nameEn,
        plan: course.plan,
        price: course.price,
        currency: course.currency,
        locale,
        utmSource: searchParams.get("utm_source"),
        utmMedium: searchParams.get("utm_medium"),
        utmCampaign: searchParams.get("utm_campaign"),
        utmContent: searchParams.get("utm_content"),
        utmTerm: searchParams.get("utm_term"),
        referrer: document.referrer,
        landingPage: window.location.href,
      }),
    });

    if (response.ok) {
      setStatus("success");
      setMessage(labels.success);
      event.currentTarget.reset();
    } else {
      setStatus("error");
      setMessage(labels.error);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-5 backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-amber-500">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{labels.title}</h3>
          <p className="mt-1 text-sm leading-6 text-white/60">{labels.subtitle}</p>
        </div>
      </div>

      <Show when="signed-out">
        <SignUpButton mode="modal" forceRedirectUrl={`/${locale}#academy`}>
          <Button className="mt-5 w-full bg-gradient-to-r from-red-500 to-amber-500 text-white">
            {labels.signUp}
          </Button>
        </SignUpButton>
      </Show>

      <Show when="signed-in">
        <form onSubmit={onSubmit} className="mt-5 grid gap-3">
          <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/65">
            {user?.primaryEmailAddress?.emailAddress}
          </div>
          <select
            name="courseId"
            required
            className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {locale === "mn" ? course.nameMn : course.nameEn}
              </option>
            ))}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="phone"
              required
              placeholder={labels.phone}
              className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400"
            />
            <input
              name="country"
              required
              placeholder={labels.country}
              className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="city"
              required
              placeholder={labels.city}
              className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400"
            />
            <input
              name="currentWork"
              required
              placeholder={labels.currentWork}
              className="h-11 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400"
            />
          </div>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-fit bg-gradient-to-r from-red-500 to-amber-500 text-white"
          >
            <Send className="h-4 w-4" />
            {labels.submit}
          </Button>
          {message ? (
            <p className={status === "success" ? "text-sm text-emerald-300" : "text-sm text-red-300"}>
              {message}
            </p>
          ) : null}
        </form>
      </Show>
    </div>
  );
}
