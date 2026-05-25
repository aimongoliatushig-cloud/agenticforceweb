import { NextResponse } from "next/server";
import { articleIndustries } from "@/lib/article-industries";

export async function GET() {
  return NextResponse.json(
    articleIndustries.map((industry) => ({
      name: industry.en.label,
      nameMn: industry.mn.label,
      slug: industry.slug,
    }))
  );
}
