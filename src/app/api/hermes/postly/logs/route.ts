import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/lib/db";
import { asString, readJson, requireSecret, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = requireSecret(request, "HERMES_AGENT_SECRET", "x-hermes-secret");
  if (denied) return denied;
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });

  const body = await readJson(request);
  await writeAgentLog({
    companyId: asString(body.companyId),
    contentItemId: asString(body.contentItemId),
    agentName: asString(body.agentName) || "Hermes",
    action: asString(body.action) || "postly.log",
    status: asString(body.status) || "info",
    message: asString(body.message),
    rawPayload: body.rawPayload ?? body,
  });

  return NextResponse.json({ ok: true });
}
