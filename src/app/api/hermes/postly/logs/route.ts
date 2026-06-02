import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const logSchema = z.object({
  event: z.string().min(1),
  brandId: z.string().optional(),
  itemId: z.string().optional(),
  status: z.string().optional().default("success"),
  message: z.string().optional(),
  metadata: z.any().optional(),
});

export async function POST(request: NextRequest) {
  const expected = process.env.HERMES_AGENT_SECRET;
  const provided = request.headers.get("x-hermes-secret");
  if (!expected || provided !== expected) return unauthorized();

  const body = await request.json().catch(() => null);
  const input = logSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: input.error.flatten() },
      { status: 400 }
    );
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const log = await prisma.postlyOperationalLog.create({
    data: {
      event: input.data.event,
      brandId: input.data.brandId,
      itemId: input.data.itemId,
      status: input.data.status,
      message: input.data.message,
      metadata: input.data.metadata || undefined,
    },
  });

  return NextResponse.json({ ok: true, log });
}
