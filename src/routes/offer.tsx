import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { LegalContent } from "@/components/sections/legal-content";
import { offerAgreement } from "@/content/legal";

const title = "Договір оферти — умови оформлення страхування онлайн";
const description =
  "Публічна оферта Страховки: умови оформлення страхових полісів онлайн, оплата, права та обов'язки сторін. Ознайомтеся перед поданням заявки.";

export const Route = createFileRoute("/offer")({
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
      { property: "og:url", content: "https://strahovki.kh.ua/offer" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/offer" }],
  }),
  component: OfferPage,
});

function OfferPage() {
  return (
    <>
      <PageHero
        eyebrow="Правова інформація"
        title="Договір оферти"
        subtitle="Публічна пропозиція укласти договір про надання послуг у сфері страхування."
      />
      <LegalContent blocks={offerAgreement} />
    </>
  );
}
