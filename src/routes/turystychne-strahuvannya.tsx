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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage content={products.travel} />,
});
