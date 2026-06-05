import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

type CompanyPayload = {
  companyName?: string;
  businessType?: string;
  activityDirection?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  workingHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  productsServices?: string[] | string;
  logoUrl?: string;
  plan?: string;
  postingFrequency?: string;
  postingTime?: string;
  postingDays?: string[];
  contentMix?: unknown;
  locale?: string;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : undefined;
}

function cleanDays(value: unknown) {
  return Array.isArray(value)
    ? value.filter((day): day is string => typeof day === "string")
    : undefined;
}

function cleanStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split("\n").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

async function getClerkUser() {
  const session = await auth();
  if (!session.userId) return null;

  const client = await clerkClient();
  return client.users.getUser(session.userId);
}

function userPayload(clerkUser: Awaited<ReturnType<typeof getClerkUser>>) {
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  return {
    clerkUserId: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || email,
    email,
    imageUrl: clerkUser.imageUrl,
  };
}

function metadataProfile(clerkUser: NonNullable<Awaited<ReturnType<typeof getClerkUser>>>) {
  const profile = clerkUser.privateMetadata?.companyProfile;
  return typeof profile === "object" && profile !== null ? profile : null;
}

function metadataPayload(body: CompanyPayload) {
  return {
    companyName: cleanString(body.companyName) ?? "",
    businessType: cleanString(body.businessType) ?? "",
    activityDirection: cleanString(body.activityDirection) ?? "",
    description: cleanString(body.description) ?? "",
    phone: cleanString(body.phone) ?? "",
    email: cleanString(body.email) ?? "",
    website: cleanString(body.website) ?? "",
    address: cleanString(body.address) ?? "",
    workingHours: cleanString(body.workingHours) ?? "",
    facebookUrl: cleanString(body.facebookUrl) ?? "",
    instagramUrl: cleanString(body.instagramUrl) ?? "",
    tiktokUrl: cleanString(body.tiktokUrl) ?? "",
    productsServices: cleanStringList(body.productsServices),
    logoUrl: cleanString(body.logoUrl)?.startsWith("data:") ? "" : cleanString(body.logoUrl) ?? "",
    plan: cleanString(body.plan) || "Starter",
    postingFrequency: cleanString(body.postingFrequency) ?? "",
    postingTime: cleanString(body.postingTime) ?? "",
    postingDays: cleanDays(body.postingDays) ?? [],
    contentMix: body.contentMix ?? null,
  };
}

export async function GET() {
  try {
    const clerkUser = await getClerkUser();
    const user = userPayload(clerkUser);

    if (!clerkUser || !user) {
      return NextResponse.json({ authenticated: false, user: null, profile: null });
    }

    if (!hasDatabaseUrl()) {
      return NextResponse.json({
        authenticated: true,
        user,
        profile: metadataProfile(clerkUser),
        stored: Boolean(metadataProfile(clerkUser)),
        storage: "clerk",
      });
    }

    const profile = await prisma.companyProfile.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    return NextResponse.json({ authenticated: true, user, profile, stored: Boolean(profile) });
  } catch {
    return NextResponse.json({ authenticated: false, user: null, profile: null }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const clerkUser = await getClerkUser();
    const user = userPayload(clerkUser);

    if (!clerkUser || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as CompanyPayload;
    const metadataProfile = metadataPayload(body);

    if (!hasDatabaseUrl()) {
      const client = await clerkClient();
      try {
        await client.users.updateUserMetadata(clerkUser.id, {
          privateMetadata: {
            ...clerkUser.privateMetadata,
            companyProfile: metadataProfile,
          },
        });

        return NextResponse.json({ ok: true, stored: true, storage: "clerk", profile: metadataProfile });
      } catch (error) {
        console.error("Company profile Clerk metadata save failed", error);
        return NextResponse.json({ ok: true, stored: false, storage: "browser", profile: metadataProfile }, { status: 202 });
      }
    }

    try {
      const appUser = await prisma.user.upsert({
        where: { clerkUserId: clerkUser.id },
        update: {
          email: user.email.toLowerCase(),
          name: user.name,
          locale: normalizeLocale(body.locale),
          lastSeenAt: new Date(),
        },
        create: {
          clerkUserId: clerkUser.id,
          email: user.email.toLowerCase(),
          name: user.name,
          locale: normalizeLocale(body.locale),
          lastSeenAt: new Date(),
        },
      });

      const profile = await prisma.companyProfile.upsert({
        where: { clerkUserId: clerkUser.id },
        update: {
          userId: appUser.id,
          companyName: cleanString(body.companyName),
          businessType: cleanString(body.businessType),
          activityDirection: cleanString(body.activityDirection),
          description: cleanString(body.description),
          phone: cleanString(body.phone),
          email: cleanString(body.email),
          website: cleanString(body.website),
          address: cleanString(body.address),
          workingHours: cleanString(body.workingHours),
          facebookUrl: cleanString(body.facebookUrl),
          instagramUrl: cleanString(body.instagramUrl),
          tiktokUrl: cleanString(body.tiktokUrl),
          productsServices: cleanStringList(body.productsServices),
          logoUrl: cleanString(body.logoUrl),
          plan: cleanString(body.plan) || "Starter",
          postingFrequency: cleanString(body.postingFrequency),
          postingTime: cleanString(body.postingTime),
          postingDays: cleanDays(body.postingDays) ?? [],
          contentMix: body.contentMix ?? undefined,
        },
        create: {
          userId: appUser.id,
          clerkUserId: clerkUser.id,
          companyName: cleanString(body.companyName),
          businessType: cleanString(body.businessType),
          activityDirection: cleanString(body.activityDirection),
          description: cleanString(body.description),
          phone: cleanString(body.phone),
          email: cleanString(body.email),
          website: cleanString(body.website),
          address: cleanString(body.address),
          workingHours: cleanString(body.workingHours),
          facebookUrl: cleanString(body.facebookUrl),
          instagramUrl: cleanString(body.instagramUrl),
          tiktokUrl: cleanString(body.tiktokUrl),
          productsServices: cleanStringList(body.productsServices),
          logoUrl: cleanString(body.logoUrl),
          plan: cleanString(body.plan) || "Starter",
          postingFrequency: cleanString(body.postingFrequency),
          postingTime: cleanString(body.postingTime),
          postingDays: cleanDays(body.postingDays) ?? [],
          contentMix: body.contentMix ?? undefined,
        },
      });

      return NextResponse.json({ ok: true, stored: true, storage: "database", profile });
    } catch (error) {
      console.error("Company profile database save failed", error);
      const client = await clerkClient();
      try {
        await client.users.updateUserMetadata(clerkUser.id, {
          privateMetadata: {
            ...clerkUser.privateMetadata,
            companyProfile: metadataProfile,
          },
        });

        return NextResponse.json({ ok: true, stored: true, storage: "clerk", profile: metadataProfile });
      } catch (metadataError) {
        console.error("Company profile fallback metadata save failed", metadataError);
        return NextResponse.json({ ok: true, stored: false, storage: "browser", profile: metadataProfile }, { status: 202 });
      }
    }
  } catch {
    return NextResponse.json({ error: "Company profile save failed" }, { status: 500 });
  }
}
