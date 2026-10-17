import { createFileRoute } from "@tanstack/react-router";
import { HomeHero } from "@/components/sections/hero";
import {
  AdvantagesSection,
  FaqSection,
  HowItWorksSection,
  ServiceCardsSection,
  TestimonialsSection,
} from "@/components/sections/sections";
import { ContactFormSection } from "@/components/sections/contact";
import { homeFaq, home } from "@/content/site";
import { CalculatorWithProductSwitch } from "@/components/calculator/calculator-switch";
import { ConsultantSection } from "@/components/sections/consultant";
import shareImageAsset from "@/assets/home-share-current.jpg.asset.json";


const title = "Страхування онлайн — автоцивілка та зелена карта | Страховки";
const description =
  "Оформіть автоцивілку, зелену карту, туристичне чи спортивне страхування онлайн. Розрахунок вартості та допомога страхового консультанта.";

const ogImage =
  new URL(shareImageAsset.url, "https://strahovki.kh.ua").href;

export const Route = createFileRoute("/")({
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
      { property: "og:url", content: "https://strahovki.kh.ua/" },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Страховки",
          url: "https://strahovki.kh.ua",
        }),
      },
    ],
  }),
  component: Index,
});


function Index() {
  return (
    <>
      <HomeHero
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        subtitle={home.hero.subtitle}
        primary={home.hero.primaryCta}
        secondary={home.hero.secondaryCta}
      />
      <CalculatorWithProductSwitch />
      <ServiceCardsSection />
      <ConsultantSection />
      <AdvantagesSection
        title={home.advantages.title}
        subtitle={home.advantages.subtitle}
        items={home.advantages.items}
        withStats
      />
      <HowItWorksSection />
      <FaqSection items={homeFaq} />
      <TestimonialsSection />
      <ContactFormSection
        title={home.contactSection.title}
        subtitle={home.contactSection.subtitle}
      />

    </>
  );
}
