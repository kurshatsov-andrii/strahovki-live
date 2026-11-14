import { createFileRoute } from "@tanstack/react-router";
import { TravelCountryPage, travelCountryHead } from "@/components/templates/travel-country-page";
import { travelCountries } from "@/content/travel-countries";

const country = travelCountries.find((c) => c.slug === "slovachchynu")!;

export const Route = createFileRoute("/strahovka-v-slovachchynu")({
  head: () => travelCountryHead(country),
  component: () => <TravelCountryPage country={country} />,
});
