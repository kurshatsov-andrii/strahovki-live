import { createFileRoute } from "@tanstack/react-router";
import { AutoAudiencePage, autoAudienceHead } from "@/components/templates/auto-audience-page";
import { autoAudiences } from "@/content/auto-audiences";

const audience = autoAudiences.find((a) => a.slug === "yevronomery")!;

export const Route = createFileRoute("/strahovka-na-yevronomery")({
  head: () => autoAudienceHead(audience),
  component: () => <AutoAudiencePage audience={audience} />,
});
