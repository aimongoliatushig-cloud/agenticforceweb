import { PostlyContentStatus } from "@prisma/client";

const contentStatusAliases: Record<string, PostlyContentStatus> = {
  DRAFT: PostlyContentStatus.DRAFT_GENERATED,
  PENDING: PostlyContentStatus.WAITING_APPROVAL,
  PENDING_APPROVAL: PostlyContentStatus.WAITING_APPROVAL,
  PUBLISHED: PostlyContentStatus.POSTED,
  REVISION: PostlyContentStatus.NEEDS_REVISION,
};

export function parsePostlyContentStatus(value: unknown, fallback?: PostlyContentStatus) {
  if (typeof value !== "string") return fallback;

  const normalized = value.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (!normalized) return fallback;
  if (contentStatusAliases[normalized]) return contentStatusAliases[normalized];

  return Object.values(PostlyContentStatus).includes(normalized as PostlyContentStatus)
    ? (normalized as PostlyContentStatus)
    : fallback;
}
