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


const title = "Страховки — онлайн страхування авто, зелена карта, туризм і спорт";
const description =
  "Оформіть автоцивілку, зелену карту, туристичне чи спортивне страхування онлайн за кілька хвилин. Реальні тарифи та електронний поліс.";

const ogImage =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/32880bab4f44acd4c53e8e0f0eab6792/id-preview-fd8b47f1--7369b7ec-2c91-4e60-b2e1-8d008945eb01.lovable.app-1786536089778.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.live/" },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.live/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Страховки",
          url: "https://strahovki.live",
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
