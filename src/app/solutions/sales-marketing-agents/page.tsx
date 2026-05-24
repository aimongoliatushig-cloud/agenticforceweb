import type { Metadata } from "next";
import { SalesMarketingOverviewPage } from "@/features/solutions";

export const metadata: Metadata = {
  title: "Sales & Marketing Agents | AgenticForce",
  description:
    "An enterprise AI command center for lead generation, content, nurturing, scoring, reporting, and human sales handoff.",
};

export default function SalesMarketingAgentsPage() {
  return <SalesMarketingOverviewPage />;
}
