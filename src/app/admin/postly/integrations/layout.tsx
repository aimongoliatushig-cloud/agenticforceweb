import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";

export default async function AdminPostlyIntegrationsLayout({ children }: { children: React.ReactNode }) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/en");

  return children;
}
