import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isClerkConfigured } from "@/lib/clerk-config";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import {
  getRequestMetadata,
  normalizeAcademyEnrollmentToHermes,
  sendSignupToHermes,
} from "@/lib/hermes-signup";
import { normalizeLocale } from "@/lib/i18n";
import { publicFormGuard } from "@/lib/public-form-guard";

const schema = z.object({
  email: z.string().email().max(180).optional(),
  phone: z.string().min(6).max(40),
  country: z.string().min(2).max(120),
  city: z.string().min(2).max(120),
  currentWork: z.string().min(2).max(240),
  courseId: z.string().min(2).max(120),
  courseName: z.string().min(2).max(180),
  plan: z.string().max(120).optional().nullable(),
  price: z.string().max(80).optional().nullable(),
  currency: z.string().max(12).optional().nullable(),
  locale: z.string().optional(),
  utmSource: z.string().max(160).optional().nullable(),
  utmMedium: z.string().max(160).optional().nullable(),
  utmCampaign: z.string().max(160).optional().nullable(),
  utmContent: z.string().max(160).optional().nullable(),
  utmTerm: z.string().max(160).optional().nullable(),
  referrer: z.string().max(1000).optional().nullable(),
  landingPage: z.string().max(1000).optional().nullable(),
  website: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = schema.safeParse(body);
  if (!input.success) {
    return NextResponse.json({ error: "Invalid enrollment request" }, { status: 400 });
  }
  const denied = publicFormGuard(request, body || {});
  if (denied) return denied;

  let userId: string | null = null;
  if (isClerkConfigured()) {
    try {
      const session = await auth();
      userId = session.userId;
    } catch {
      return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  const clerkUser = userId ? await (await clerkClient()).users.getUser(userId) : null;
  const email = (clerkUser?.emailAddresses[0]?.emailAddress || input.data.email)?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const fullName = clerkUser?.fullName || [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ");
  const requestMetadata = await getRequestMetadata();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const appUser = userId
        ? await tx.user.upsert({
            where: { clerkUserId: userId },
            update: {
              email,
              name: fullName || null,
              phone: input.data.phone,
              country: input.data.country,
              city: input.data.city,
              currentWork: input.data.currentWork,
              locale: normalizeLocale(input.data.locale),
              lastSeenAt: new Date(),
            },
            create: {
              clerkUserId: userId,
              email,
              name: fullName || null,
              phone: input.data.phone,
              country: input.data.country,
              city: input.data.city,
              currentWork: input.data.currentWork,
              locale: normalizeLocale(input.data.locale),
              lastSeenAt: new Date(),
            },
          })
        : null;

      const enrollmentData = {
        userId: appUser?.id,
        clerkUserId: userId,
        email,
        phone: input.data.phone,
        firstName: clerkUser?.firstName,
        lastName: clerkUser?.lastName,
        fullName: fullName || null,
        country: input.data.country,
        city: input.data.city,
        currentWork: input.data.currentWork,
        courseId: input.data.courseId,
        courseName: input.data.courseName,
        plan: input.data.plan,
        price: input.data.price,
        currency: input.data.currency,
        locale: normalizeLocale(input.data.locale),
        utmSource: input.data.utmSource,
        utmMedium: input.data.utmMedium,
        utmCampaign: input.data.utmCampaign,
        utmContent: input.data.utmContent,
        utmTerm: input.data.utmTerm,
        referrer: input.data.referrer,
        landingPage: input.data.landingPage,
        userAgent: requestMetadata.userAgent,
      };

      const enrollment = userId
        ? await tx.academyEnrollment.upsert({
            where: {
              clerkUserId_courseId: {
                clerkUserId: userId,
                courseId: input.data.courseId,
              },
            },
            update: enrollmentData,
            create: enrollmentData,
          })
        : await tx.academyEnrollment.create({ data: enrollmentData });

      return { appUser, enrollment };
    });

    const payload = normalizeAcademyEnrollmentToHermes({
      enrollment: result.enrollment,
      ipHash: requestMetadata.ipHash,
    });

    await sendSignupToHermes(payload);

    return NextResponse.json({ ok: true, enrollmentId: result.enrollment.id });
  } catch (error) {
    console.error("Academy enrollment failed", error);
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}
