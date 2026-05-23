import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const headerList = await headers();
  const language = headerList.get("accept-language")?.toLowerCase() ?? "";
  redirect(language.includes("mn") ? "/mn" : "/en");
}
