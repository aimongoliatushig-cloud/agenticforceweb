import { NextResponse } from "next/server";
import { PostlyPlatform, PostlySocialStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { asString, readJson, writeAgentLog } from "@/lib/postly";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }

  const allowed = await isAdminUser();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

function socialStatus(value: unknown) {
  const normalized = asString(value)?.toUpperCase();
  return normalized && Object.values(PostlySocialStatus).includes(normalized as PostlySocialStatus)
    ? (normalized as PostlySocialStatus)
    : PostlySocialStatus.CONNECTED;
}

async function upsertSocialAccount(input: {
  companyId: string;
  platform: PostlyPlatform;
  pageName?: string;
  pageId?: string;
  instagramAccountId?: string;
  accessTokenEncrypted?: string;
  status?: PostlySocialStatus;
}) {
  const existing = await prisma.socialAccount.findFirst({
    where: { companyId: input.companyId, platform: input.platform },
  });

  if (existing) {
    return prisma.socialAccount.update({
      where: { id: existing.id },
      data: {
        pageName: input.pageName,
        pageId: input.pageId,
        instagramAccountId: input.instagramAccountId,
        accessTokenEncrypted: input.accessTokenEncrypted,
        status: input.status,
      },
    });
  }

  return prisma.socialAccount.create({
    data: {
      companyId: input.companyId,
      platform: input.platform,
      pageName: input.pageName,
      pageId: input.pageId,
      instagramAccountId: input.instagramAccountId,
      accessTokenEncrypted: input.accessTokenEncrypted,
      status: input.status ?? PostlySocialStatus.CONNECTED,
    },
  });
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const companies = await prisma.companyProfile.findMany({
    orderBy: [{ companyName: "asc" }, { createdAt: "desc" }],
    include: {
      makeIntegration: true,
      socialAccounts: true,
    },
  });

  return NextResponse.json({ companies });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson(request);
  const companyId = asString(body.companyId);
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  const company = await prisma.companyProfile.findUnique({ where: { id: companyId } });
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const make = typeof body.make === "object" && body.make !== null ? (body.make as Record<string, unknown>) : {};
  const facebook = typeof body.facebook === "object" && body.facebook !== null ? (body.facebook as Record<string, unknown>) : {};
  const instagram = typeof body.instagram === "object" && body.instagram !== null ? (body.instagram as Record<string, unknown>) : {};

  const makeIntegration = await prisma.makeIntegration.upsert({
    where: { companyId },
    update: {
      webhookUrl: asString(make.webhookUrl),
      webhookSecretHint: asString(make.webhookSecretHint),
      scenarioName: asString(make.scenarioName),
      status: asString(make.status) || "inactive",
    },
    create: {
      companyId,
      webhookUrl: asString(make.webhookUrl),
      webhookSecretHint: asString(make.webhookSecretHint),
      scenarioName: asString(make.scenarioName),
      status: asString(make.status) || "inactive",
    },
  });

  const facebookAccount = await upsertSocialAccount({
    companyId,
    platform: PostlyPlatform.FACEBOOK,
    pageName: asString(facebook.pageName),
    pageId: asString(facebook.pageId),
    accessTokenEncrypted: asString(facebook.accessTokenEncrypted),
    status: socialStatus(facebook.status),
  });

  const instagramAccount = await upsertSocialAccount({
    companyId,
    platform: PostlyPlatform.INSTAGRAM,
    pageName: asString(instagram.pageName),
    pageId: asString(instagram.pageId),
    instagramAccountId: asString(instagram.instagramAccountId),
    accessTokenEncrypted: asString(instagram.accessTokenEncrypted),
    status: socialStatus(instagram.status),
  });

  await writeAgentLog({
    companyId,
    agentName: "Postly Admin",
    action: "integrations.upsert",
    status: "success",
    message: `Admin updated Postly integrations for ${company.companyName ?? company.id}`,
    rawPayload: {
      companyId,
      make: { ...make, webhookUrl: make.webhookUrl ? "[configured]" : undefined },
      facebook: { ...facebook, accessTokenEncrypted: facebook.accessTokenEncrypted ? "[configured]" : undefined },
      instagram: { ...instagram, accessTokenEncrypted: instagram.accessTokenEncrypted ? "[configured]" : undefined },
    },
  });

  return NextResponse.json({
    ok: true,
    makeIntegration,
    socialAccounts: [facebookAccount, instagramAccount],
  });
}
