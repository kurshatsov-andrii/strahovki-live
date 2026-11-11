import { createFileRoute } from "@tanstack/react-router";
import { GreenCardCountryPage, greenCardCountryHead } from "@/components/templates/green-card-country-page";
import { greenCardCountries } from "@/content/green-card-countries";

const country = greenCardCountries.find((c) => c.slug === "polshcha")!;

export const Route = createFileRoute("/zelena-karta-polshcha")({
  head: () => greenCardCountryHead(country),
  component: () => <GreenCardCountryPage country={country} />,
});
