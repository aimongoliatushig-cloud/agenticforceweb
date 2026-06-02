import PostlyAdminShell from "../PostlyAdminShell";
import IntegrationsManager from "./IntegrationsManager";

export const dynamic = "force-dynamic";

function adminLang(value: unknown): "en" | "mn" {
  return value === "mn" ? "mn" : "en";
}

export default async function AdminPostlyIntegrationsPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const currentLang = adminLang(lang);

  return (
    <PostlyAdminShell active="settings" lang={currentLang} currentPath="/admin/postly/integrations">
      <IntegrationsManager lang={currentLang} />
    </PostlyAdminShell>
  );
}
