import { auth, currentUser } from "@clerk/nextjs/server";
import { hasDatabaseUrl, prisma } from "./db";

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
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress.toLowerCase();

    if (email && adminEmails.includes(email)) {
      return true;
    }
  } catch {
    return false;
  }

  const appUser = await getAppUser();
  return appUser?.role === "admin";
}
