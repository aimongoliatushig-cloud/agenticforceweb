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

export default async function AdminPostlyLogsPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  const { lang: rawLang } = await searchParams;
  const currentLang = lang(rawLang);
  const items = hasDatabaseUrl()
    ? await prisma.contentItem.findMany({
        where: {
          OR: [
            { status: PostlyContentStatus.POSTED },
            { postingLogs: { some: {} } },
          ],
        },
        orderBy: [{ updatedAt: "desc" }],
        take: 150,
        include: {
          company: true,
          template: true,
          approvalRequests: { orderBy: { createdAt: "desc" }, take: 3 },
          postingLogs: { orderBy: { createdAt: "desc" }, take: 5 },
        },
      })
    : [];

  return (
    <PostlyAdminShell active="logs" lang={currentLang} currentPath="/admin/postly/logs">
      <ContentWorkflowManager initialItems={JSON.parse(JSON.stringify(items))} mode="logs" lang={currentLang} />
    </PostlyAdminShell>
  );
}
