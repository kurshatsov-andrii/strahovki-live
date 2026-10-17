import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { LegalContent } from "@/components/sections/legal-content";
import { privacyPolicy } from "@/content/legal";

const title = "Політика конфіденційності — Страховки";
const description =
  "Як сайт Страховки збирає, використовує та захищає персональні дані користувачів, cookie-файли та розсилки.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://strahovki.kh.ua/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Правова інформація"
        title="Політика конфіденційності"
        subtitle="Ми відповідально ставимося до збереження інформації, наданої користувачами сайту."
      />
      <LegalContent blocks={privacyPolicy} />
    </>
  );
}
