import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Aithon2026Client } from "./Aithon2026Client";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-aithon",
});

export const metadata: Metadata = {
  title: "Smart City AI Hackathon 2026 | AgenticForce",
  description:
    "Ахлах анги болон оюутан залуус AI ашиглан хотын бодит асуудлыг 2 өдрийн дотор шийдэх Smart City AI Hackathon.",
  openGraph: {
    title: "Smart City AI Hackathon 2026",
    description: "AI ашиглан ирээдүйн хотоо бүтээе.",
    images: [
      {
        url: "/aithon2026-hero.png",
        width: 1920,
        height: 1080,
        alt: "Smart City AI Hackathon 2026 futuristic city",
      },
    ],
  },
};

export default function Aithon2026Page() {
  return (
    <div className={`${manrope.variable} font-[var(--font-aithon)]`}>
      <Aithon2026Client />
    </div>
  );
}
