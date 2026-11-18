import { createFileRoute } from "@tanstack/react-router";
import { AutoAudiencePage, autoAudienceHead } from "@/components/templates/auto-audience-page";
import { autoAudiences } from "@/content/auto-audiences";

const audience = autoAudiences.find((a) => a.slug === "ubd")!;

export const Route = createFileRoute("/avtotsyvilka-dlia-ubd")({
  head: () => autoAudienceHead(audience),
  component: () => <AutoAudiencePage audience={audience} />,
});
