import { createFileRoute } from "@tanstack/react-router";
import { AutoAudiencePage, autoAudienceHead } from "@/components/templates/auto-audience-page";
import { autoAudiences } from "@/content/auto-audiences";

const audience = autoAudiences.find((a) => a.slug === "inozemna-reiestratsiia")!;

export const Route = createFileRoute("/avtotsyvilka-na-inozemni-nomera")({
  head: () => autoAudienceHead(audience),
  component: () => <AutoAudiencePage audience={audience} />,
});
