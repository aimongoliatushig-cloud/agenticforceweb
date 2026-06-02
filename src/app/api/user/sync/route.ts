import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/lib/db";
import { syncUserRecord } from "@/lib/user-sync";

function getPrimaryEmail(clerkUser: Awaited<ReturnType<Awaited<ReturnType<typeof clerkClient>>["users"]["getUser"]>>) {
  const primary = clerkUser.emailAddresses.find((item) => item.id === clerkUser.primaryEmailAddressId);
  return (primary || clerkUser.emailAddresses[0])?.emailAddress?.toLowerCase();
}

export async function POST(request: Request) {
  let clerkUser;
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    clerkUser = await client.users.getUser(session.userId);
  } catch {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 401 });
  }

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const email = getPrimaryEmail(clerkUser);
  if (!email) {
    return NextResponse.json({ error: "User has no email" }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const user = await syncUserRecord({
      clerkUserId: clerkUser.id,
      email,
      name: clerkUser.fullName || clerkUser.firstName || email,
      avatarUrl: clerkUser.imageUrl || null,
      locale: typeof body.locale === "string" ? body.locale : undefined,
    });

    return NextResponse.json({ ok: true, id: user.id });
  } catch {
    return NextResponse.json({ error: "User sync failed" }, { status: 500 });
  }
}
