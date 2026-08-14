import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";

const title = "Спортивне страхування онлайн — страховка від травм";
const description =
  "Застрахуйте себе або команду від спортивних травм. Індивідуальні та командні тарифи.";

export const Route = createFileRoute("/sportyvne-strahuvannya")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.live/sportyvne-strahuvannya" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.live/sportyvne-strahuvannya" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Спортивне страхування",
          serviceType: "Спортивне страхування",
          url: "https://strahovki.live/sportyvne-strahuvannya",
          areaServed: "UA",
          provider: { "@type": "LocalBusiness", name: "Страховки" },
        }),
      },
    ],
  }),
  component: () => <ProductPage content={products.sport} product="sport" />,
});
