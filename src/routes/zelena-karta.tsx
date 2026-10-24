import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";
import { breadcrumbScript } from "@/lib/jsonld";

const title = "Зелена карта на авто онлайн — ціна та оформлення";
const description =
  "Оформіть зелену карту на авто для виїзду за кордон. Розрахуйте ціну поліса на строк від 15 днів до року. Перевірка в МТСБУ та допомога консультанта.";

export const Route = createFileRoute("/zelena-karta")({
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
      { property: "og:url", content: "https://strahovki.kh.ua/zelena-karta" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/zelena-karta" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Зелена карта",
          serviceType: "Зелена карта",
          url: "https://strahovki.kh.ua/zelena-karta",
          areaServed: "UA",
          provider: { "@type": "LocalBusiness", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Зелена карта", path: "/zelena-karta" },
      ]),
    ],
  }),
  component: () => <ProductPage content={products.greenCard} product="green_card" />,
});
