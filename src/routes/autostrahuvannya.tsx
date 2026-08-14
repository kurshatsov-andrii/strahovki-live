import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";

const title = "Автоцивілка онлайн — розрахувати та купити поліс ОСЦПВ";
const description =
  "Розрахуйте вартість автоцивілки та оформіть поліс ОСЦПВ онлайн за кілька хвилин. Електронний поліс на email і в Telegram.";

export const Route = createFileRoute("/autostrahuvannya")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.live/autostrahuvannya" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.live/autostrahuvannya" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Автоцивілка (ОСЦПВ)",
          serviceType: "Автоцивілка (ОСЦПВ)",
          url: "https://strahovki.live/autostrahuvannya",
          areaServed: "UA",
          provider: { "@type": "LocalBusiness", name: "Страховки" },
        }),
      },
    ],
  }),
  component: () => <ProductPage content={products.auto} product="auto" />,
});
