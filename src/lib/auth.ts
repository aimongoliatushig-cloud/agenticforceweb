import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { hasDatabaseUrl, prisma } from "./db";

const defaultAdminEmails = ["nyffygodx0206@gmail.com"];
const adminBypassCookie = "postly_admin_bypass";

export function getAdminEmails() {
  return [...defaultAdminEmails, ...(process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)];
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && getAdminEmails().includes(email.trim().toLowerCase()));
}

function sessionEmails(session: Awaited<ReturnType<typeof auth>>) {
  const claims = session.sessionClaims as Record<string, unknown> | undefined;
  const emailCandidates = [
    claims?.email,
    claims?.primary_email,
    claims?.primaryEmail,
    (claims?.primary_email_address as { email_address?: unknown } | undefined)?.email_address,
  ];

  return emailCandidates
    .filter((email): email is string => typeof email === "string")
    .map((email) => email.toLowerCase());
}

async function hasAdminBypassCookie() {
  const token = process.env.POSTLY_ADMIN_BYPASS_TOKEN?.trim();
  if (!token) return false;

  try {
    const cookieStore = await cookies();
    return cookieStore.get(adminBypassCookie)?.value === token;
  } catch {
    return false;
  }
}

export async function getCurrentUserId() {
  try {
    const session = await auth();
    if (session.userId) return session.userId;
  } catch {
    // Fall through to currentUser; auth() can be unavailable in some API paths.
  }

  try {
    return (await currentUser())?.id ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUserEmails() {
  const emails = new Set<string>();
  let userId: string | null = null;

  try {
    const session = await auth();
    userId = session.userId ?? null;
    sessionEmails(session).forEach((email) => emails.add(email));
  } catch {
    // Continue with currentUser and local user fallbacks below.
  }

  try {
    const clerkUser = await currentUser();
    if (clerkUser?.id) userId = clerkUser.id;
    clerkUser?.emailAddresses.forEach((item) => {
      if (item.emailAddress) emails.add(item.emailAddress.toLowerCase());
    });
  } catch {
    // Backend client fallback below can still resolve emails from userId.
  }

  if (userId) {
    try {
      const appUser = hasDatabaseUrl()
        ? await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { email: true } })
        : null;
      if (appUser?.email) emails.add(appUser.email.toLowerCase());
    } catch {
      // Best-effort enrichment; Clerk remains the source of truth.
    }

    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      clerkUser.emailAddresses.forEach((item) => {
        if (item.emailAddress) emails.add(item.emailAddress.toLowerCase());
      });
    } catch {
      // Session and local user emails are enough for fallback matching.
    }
  }

  return Array.from(emails).filter(Boolean);
}

export async function getAppUser() {
  const clerkUserId = await getCurrentUserId();
  if (!clerkUserId || !hasDatabaseUrl()) {
    return null;
  }

  try {
    return await prisma.user.findUnique({ where: { clerkUserId } });
  } catch {
    return null;
  }
}

export async function isAdminUser() {
  if (await hasAdminBypassCookie()) {
    return true;
  }

  const emails = await getCurrentUserEmails();
  if (emails.some((email) => isAdminEmail(email))) {
    return true;
  }

  const appUser = await getAppUser();
  return appUser?.role === "admin";
}
