import { createFileRoute } from "@tanstack/react-router";
import { TravelAudiencePage, travelAudienceHead } from "@/components/templates/travel-audience-page";
import { travelAudiences } from "@/content/travel-audiences";

const audience = travelAudiences.find((a) => a.path === "/strahovka-dlia-roboty-za-kordonom")!;

export const Route = createFileRoute("/strahovka-dlia-roboty-za-kordonom")({
  head: () => travelAudienceHead(audience),
  component: () => <TravelAudiencePage audience={audience} />,
});
