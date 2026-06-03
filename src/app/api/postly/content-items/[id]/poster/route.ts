import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeColor(value: string | null | undefined, fallback: string) {
  const color = value?.trim();
  return color && /^#[0-9a-f]{3,8}$/i.test(color) ? color : fallback;
}

function wrapText(text: string, maxChars: number, maxLines: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }

    if (lines.length === maxLines) break;
  }

  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function textLines(lines: string[], x: number, y: number, size: number, color: string, weight = 800, gap = 1.18) {
  return lines
    .map((line, index) => `<text x="${x}" y="${y + index * size * gap}" fill="${color}" font-size="${size}" font-weight="${weight}">${escapeXml(line)}</text>`)
    .join("");
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const { id } = await context.params;
  const item = await prisma.contentItem.findUnique({
    where: { id },
    include: {
      company: { include: { brandGuideline: true } },
      template: true,
    },
  });

  if (!item) return NextResponse.json({ error: "Content item not found" }, { status: 404 });

  const colors = item.company.brandGuideline?.brandColors ?? [];
  const dark = normalizeColor(colors[0], "#101820");
  const accent = normalizeColor(colors[1], "#F2AA4C");
  const light = normalizeColor(colors[2], "#FFFFFF");
  const backgroundUrl = item.template?.previewImageUrl || item.template?.templateFileUrl || "";
  const brandName = item.company.companyName || "Postly";
  const headline = item.headline || item.title || "Шинэ постер";
  const caption = item.caption?.split("\n").find((line) => line.trim() && !line.toLowerCase().includes("caption")) || item.imagePrompt || "";
  const phone = item.company.phone || "8909 7454";
  const address = item.company.address || "";

  const headlineSvg = textLines(wrapText(headline, 22, 3), 138, 430, 64, light, 900, 1.1);
  const captionSvg = textLines(wrapText(caption, 54, 3), 142, 650, 27, light, 600, 1.35);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="${dark}"/>
  ${backgroundUrl ? `<image href="${escapeXml(backgroundUrl)}" x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice"/>` : ""}
  <rect x="92" y="322" width="896" height="430" rx="34" fill="${dark}" opacity="0.74"/>
  <rect x="92" y="322" width="896" height="430" rx="34" fill="none" stroke="${accent}" stroke-width="3" opacity="0.78"/>
  <text x="142" y="385" fill="${accent}" font-size="27" font-weight="800" letter-spacing="4">${escapeXml(brandName.toUpperCase())}</text>
  ${headlineSvg}
  ${captionSvg}
  <rect x="142" y="814" width="796" height="92" rx="26" fill="${dark}" opacity="0.86"/>
  <circle cx="192" cy="860" r="18" fill="${accent}"/>
  <text x="226" y="853" fill="${light}" font-size="27" font-weight="800">${escapeXml(phone)}</text>
  <text x="226" y="886" fill="${light}" opacity="0.74" font-size="21" font-weight="600">${escapeXml(address || "Дэлгэрэнгүй мэдээлэл авах")}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
