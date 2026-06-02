import { redirect } from "next/navigation";
import { PostlyContentStatus } from "@prisma/client";
import { isAdminUser } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import ContentWorkflowManager from "../content/ContentWorkflowManager";
import PostlyAdminShell from "../PostlyAdminShell";

export const dynamic = "force-dynamic";

function lang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

export default async function AdminPostlyCalendarPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  const { lang: rawLang } = await searchParams;
  const currentLang = lang(rawLang);
  const items = hasDatabaseUrl()
    ? await prisma.contentItem.findMany({
        where: {
          status: {
            in: [
              PostlyContentStatus.PLANNED,
              PostlyContentStatus.DRAFT_GENERATED,
              PostlyContentStatus.WAITING_APPROVAL,
              PostlyContentStatus.APPROVED,
              PostlyContentStatus.SCHEDULED,
            ],
          },
        },
        orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
        take: 150,
        include: {
          company: true,
          template: true,
          approvalRequests: { orderBy: { createdAt: "desc" }, take: 3 },
          postingLogs: { orderBy: { createdAt: "desc" }, take: 3 },
        },
      })
    : [];

  return (
    <PostlyAdminShell active="calendar" lang={currentLang} currentPath="/admin/postly/calendar">
      <ContentWorkflowManager initialItems={JSON.parse(JSON.stringify(items))} mode="calendar" lang={currentLang} />
    </PostlyAdminShell>
  );
}
