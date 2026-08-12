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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage content={products.sport} product="sport" />,
});
