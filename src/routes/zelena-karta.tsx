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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage content={products.greenCard} />,
});
