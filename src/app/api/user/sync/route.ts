import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  let clerkUser;
  try {
    clerkUser = await currentUser();
  } catch {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "User has no email" }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const user = await prisma.user.upsert({
      where: { clerkUserId: clerkUser.id },
      update: {
        email,
        name: clerkUser.fullName,
        locale: normalizeLocale(body.locale),
        lastSeenAt: new Date(),
      },
      create: {
        clerkUserId: clerkUser.id,
        email,
        name: clerkUser.fullName,
        locale: normalizeLocale(body.locale),
        lastSeenAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, id: user.id });
  } catch {
    return NextResponse.json({ error: "User sync failed" }, { status: 500 });
  }
}
