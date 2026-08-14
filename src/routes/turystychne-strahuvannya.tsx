import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";

const title = "Туристичне страхування онлайн — медична страховка для поїздок";
const description =
  "Оформіть туристичну медичну страховку для виїзду за кордон. Підходить для шенгенської візи.";

export const Route = createFileRoute("/turystychne-strahuvannya")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.live/turystychne-strahuvannya" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.live/turystychne-strahuvannya" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Туристичне страхування",
          serviceType: "Туристичне страхування",
          url: "https://strahovki.live/turystychne-strahuvannya",
          areaServed: "UA",
          provider: { "@type": "LocalBusiness", name: "Страховки" },
        }),
      },
    ],
  }),
  component: () => <ProductPage content={products.travel} product="travel" />,
});
