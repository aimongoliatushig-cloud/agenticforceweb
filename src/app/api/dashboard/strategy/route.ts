import { NextResponse } from "next/server";

type StrategyRequest = {
  company?: Record<string, unknown>;
  plan?: Record<string, unknown>;
  allocation?: Array<Record<string, unknown>>;
  schedule?: Array<{ day: string; items: string[] }>;
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function fallbackStrategy(body: StrategyRequest) {
  const company = body.company ?? {};
  const planName = text(body.plan?.name, "Starter");
  const companyName = text(company.companyName, "Танай компани");
  const businessType = text(company.businessType, "бизнес");
  const activity = text(company.activityDirection, "гол үйлчилгээ");
  const schedule = Array.isArray(body.schedule) ? body.schedule : [];

  return {
    brandPositioning: `${companyName} нь ${businessType}-ийн хэрэглэгчдэд ${activity}-ийг ойлгомжтой, итгэл төрүүлэх байдлаар хүргэх брэнд байршуулалттай байна.`,
    targetAudience: `${activity} хэрэгтэй, шийдвэр гаргахаасаа өмнө кейс, тайлбар, үнэ цэнэ, хурдан холбоо барих CTA хайдаг хэрэглэгчид.`,
    contentAngle: "Awareness контентоор итгэл үүсгэж, product контентоор хэрэглээг тайлбарлаж, promotion контентоор action авхуулна.",
    weeklyDirection: [
      "Awareness: асуудал, боломж, брэндийн ялгарал",
      "Product: бүтээгдэхүүн/үйлчилгээний хэрэглээ, процесс, үр дүн",
      "Sales: урамшуулал, багц, demo/request CTA",
    ],
    ctaIdeas: ["Демо авах", "Үнийн санал авах", "Зөвлөгөө авах", "Өнөөдөр холбогдох"],
    promotionIdeas: [`${planName} plan-д тохирсон limited campaign`, "Анхны захиалгад content audit", "7 хоногийн trial offer"],
    captionTone: "Мэргэжлийн, богино, ойлгомжтой, action-driven.",
    calendarDraft: schedule,
    source: "local",
  };
}

function extractOutputText(response: Record<string, any>) {
  if (typeof response.output_text === "string") return response.output_text;

  const chunks = response.output
    ?.flatMap((item: any) => item.content ?? [])
    ?.map((content: any) => content.text)
    ?.filter(Boolean);

  return chunks?.join("\n") ?? "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as StrategyRequest;
  const fallback = fallbackStrategy(body);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ strategy: fallback });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions:
          "You create concise Mongolian social media marketing strategy JSON. Return only valid JSON with keys: brandPositioning, targetAudience, contentAngle, weeklyDirection, ctaIdeas, promotionIdeas, captionTone, calendarDraft, source.",
        input: JSON.stringify({
          task: "Generate AI Marketing Operating System content strategy from company profile, subscription plan, quota allocation, and posting schedule.",
          ...body,
        }),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ strategy: fallback });
    }

    const data = await response.json();
    const output = extractOutputText(data);
    const parsed = JSON.parse(output);

    return NextResponse.json({
      strategy: {
        ...fallback,
        ...parsed,
        source: "openai",
      },
    });
  } catch {
    return NextResponse.json({ strategy: fallback });
  }
}
