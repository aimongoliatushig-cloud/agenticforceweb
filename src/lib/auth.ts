import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { hasDatabaseUrl, prisma } from "./db";

const defaultAdminEmails = ["nyffygodx0206@gmail.com"];
const adminBypassCookie = "postly_admin_bypass";

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
    return session.userId ?? null;
  } catch {
    return null;
  }
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

  const adminEmails = [...defaultAdminEmails, ...(process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)];

  try {
    const session = await auth();
    if (!session.userId) {
      return false;
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(session.userId);
    const emails = clerkUser.emailAddresses
      .map((item) => item.emailAddress.toLowerCase())
      .filter(Boolean);

    if (emails.some((email) => adminEmails.includes(email))) {
      return true;
    }
  } catch {
    return false;
  }

  const appUser = await getAppUser();
  return appUser?.role === "admin";
}
