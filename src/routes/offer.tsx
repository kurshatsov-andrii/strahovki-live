import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { LegalContent } from "@/components/sections/legal-content";
import { offerAgreement } from "@/content/legal";

const title = "Договір оферти — Страховки";
const description =
  "Публічний договір про надання послуг у сфері страхування ФОП Куршацов А.І. — умови, оплата та реквізити.";

export const Route = createFileRoute("/offer")({
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
