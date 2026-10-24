import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";
import { breadcrumbScript } from "@/lib/jsonld";

const title = "Автоцивілка онлайн — ціна та розрахунок ОСЦПВ";
const description =
  "Розрахуйте ціну автоцивілки та оформіть ОСЦПВ онлайн. Поліси для українських та іноземних номерів, пільгові тарифи. Отримайте поліс на email або в Telegram.";

export const Route = createFileRoute("/autostrahuvannya")({
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
      { property: "og:url", content: "https://strahovki.kh.ua/autostrahuvannya" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/autostrahuvannya" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Автоцивілка (ОСЦПВ)",
          serviceType: "Автоцивілка (ОСЦПВ)",
          url: "https://strahovki.kh.ua/autostrahuvannya",
          areaServed: "UA",
          provider: { "@type": "LocalBusiness", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Автоцивілка (ОСЦПВ)", path: "/autostrahuvannya" },
      ]),
    ],
  }),
  component: () => <ProductPage content={products.auto} product="auto" />,
});
