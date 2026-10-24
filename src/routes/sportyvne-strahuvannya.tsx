import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/product-page";
import { products } from "@/content/site";
import { breadcrumbScript } from "@/lib/jsonld";

const title = "Спортивне страхування — страховка для тренувань і змагань";
const description =
  "Спортивна страховка для аматорів, дітей і команд. Страхова сума 35 000 грн, строк від 1 місяця до року. Розрахуйте вартість та залиште заявку онлайн.";

export const Route = createFileRoute("/sportyvne-strahuvannya")({
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
      { property: "og:url", content: "https://strahovki.kh.ua/sportyvne-strahuvannya" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/sportyvne-strahuvannya" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Спортивне страхування",
          serviceType: "Спортивне страхування",
          url: "https://strahovki.kh.ua/sportyvne-strahuvannya",
          areaServed: "UA",
          provider: { "@type": "InsuranceAgency", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Спортивне страхування", path: "/sportyvne-strahuvannya" },
      ]),
    ],
  }),
  component: () => <ProductPage content={products.sport} product="sport" />,
});
