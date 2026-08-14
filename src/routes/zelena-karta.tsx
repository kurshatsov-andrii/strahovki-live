import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";

const title = "Зелена карта онлайн — страхування авто для виїзду за кордон";
const description =
  "Оформіть зелену карту онлайн для поїздки за кордон власним автомобілем. Розрахунок вартості за кілька секунд.";

export const Route = createFileRoute("/zelena-karta")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.live/zelena-karta" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.live/zelena-karta" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Зелена карта",
          serviceType: "Зелена карта",
          url: "https://strahovki.live/zelena-karta",
          areaServed: "UA",
          provider: { "@type": "LocalBusiness", name: "Страховки" },
        }),
      },
    ],
  }),
  component: () => <ProductPage content={products.greenCard} product="green_card" />,
});
