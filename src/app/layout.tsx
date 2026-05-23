import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";
import { Header, Footer } from "@/layouts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://agenticforce.com"),
  title: "AgenticForce - Leading to agentic era",
  description:
    "Agentic AI solutions, agentic ERP, academy training, AI news, and automation systems for modern organizations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  generator: "Mohamed Djoudir",
  openGraph: {
    title: "AgenticForce - Leading to agentic era",
    description:
      "Agentic AI solutions, agentic ERP, academy training, AI news, and automation systems for modern organizations.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "AgenticForce - agentic AI solutions",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <AppProviders>
          <Header />
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
