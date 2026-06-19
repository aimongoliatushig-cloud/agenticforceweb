import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { BurtgelClient } from "./BurtgelClient";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-aithon",
});

export const metadata: Metadata = {
  title: "AITHON 2026 Бүртгэл | AgenticForce",
  description: "Smart City AI Hackathon 2026 бүртгэгдсэн оролцогчдын жагсаалт.",
};

export default function BurtgelPage() {
  return (
    <div className={`${manrope.variable} font-[var(--font-aithon)]`}>
      <BurtgelClient />
    </div>
  );
}
