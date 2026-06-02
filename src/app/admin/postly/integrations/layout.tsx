import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import PostlyAdminShell from "../PostlyAdminShell";

export default async function AdminPostlyIntegrationsLayout({ children }: { children: React.ReactNode }) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  return (
    <PostlyAdminShell active="settings" currentPath="/admin/postly/integrations">
      {children}
    </PostlyAdminShell>
  );
}
