import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";
import { breadcrumbScript } from "@/lib/jsonld";

const title = "Туристичне страхування онлайн — страховка за кордон";
const description =
  "Медична страховка для виїзду за кордон: Європа або весь світ, покриття 30 000 євро. Розрахунок на 7–90 днів та оформлення онлайн з консультантом.";

export const Route = createFileRoute("/turystychne-strahuvannya")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://strahovki.kh.ua/turystychne-strahuvannya" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/turystychne-strahuvannya" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Туристичне страхування",
          serviceType: "Туристичне страхування",
          url: "https://strahovki.kh.ua/turystychne-strahuvannya",
          areaServed: "UA",
          provider: { "@type": "LocalBusiness", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Туристичне страхування", path: "/turystychne-strahuvannya" },
      ]),
    ],
  }),
  component: () => <ProductPage content={products.travel} product="travel" />,
});
