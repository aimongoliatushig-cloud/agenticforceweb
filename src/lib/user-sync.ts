import { UserRole } from "@prisma/client";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizeLocale } from "@/lib/i18n";

export type SyncUserInput = {
  clerkUserId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  locale?: string;
};

function resolvedRole(input: { email: string; existingRole?: UserRole | null }) {
  if (isAdminEmail(input.email)) return UserRole.admin;
  if (input.existingRole === UserRole.admin) return UserRole.admin;
  return UserRole.user;
}

export async function syncUserRecord(input: SyncUserInput) {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { clerkUserId: input.clerkUserId },
    select: { role: true },
  });
  const role = resolvedRole({ email, existingRole: existing?.role });
  const name = input.name?.trim() || email;

  return prisma.user.upsert({
    where: { clerkUserId: input.clerkUserId },
    update: {
      email,
      name,
      avatarUrl: input.avatarUrl || null,
      phone: input.phone ?? undefined,
      role,
      locale: input.locale ? normalizeLocale(input.locale) : undefined,
      lastSeenAt: new Date(),
    },
    create: {
      clerkUserId: input.clerkUserId,
      email,
      name,
      avatarUrl: input.avatarUrl || null,
      phone: input.phone ?? undefined,
      role,
      locale: normalizeLocale(input.locale),
      lastSeenAt: new Date(),
    },
  });
}
