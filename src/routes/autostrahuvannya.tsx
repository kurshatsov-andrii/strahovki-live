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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage content={products.auto} />,
});
