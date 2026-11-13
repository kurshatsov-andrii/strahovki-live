import { createFileRoute } from "@tanstack/react-router";
import { SportAudiencePage, sportAudienceHead } from "@/components/templates/sport-audience-page";
import { sportAudiences } from "@/content/sport-audiences";

const audience = sportAudiences.find((a) => a.slug === "triatletiv")!;

export const Route = createFileRoute("/sportyvne-strahuvannya-dlia-triatletiv")({
  head: () => sportAudienceHead(audience),
  component: () => <SportAudiencePage audience={audience} />,
});
