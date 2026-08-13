import { createFileRoute } from "@tanstack/react-router";
import { HomeHero } from "@/components/sections/hero";
import {
  AdvantagesSection,
  FaqSection,
  HowItWorksSection,
  PartnersSection,
  ServiceCardsSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/sections/sections";
import { ContactFormSection } from "@/components/sections/contact";
import { generalFaq, home } from "@/content/site";
import { CalculatorWithProductSwitch } from "@/components/calculator/calculator-switch";
import { ConsultantSection } from "@/components/sections/consultant";

const title = "Страховки — онлайн страхування авто, зелена карта, туризм і спорт";
const description =
  "Оформіть автоцивілку, зелену карту, туристичне чи спортивне страхування онлайн за кілька хвилин. Реальні тарифи та електронний поліс.";

export const Route = createFileRoute("/")({
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
      <ConsultantSection />
      <ServiceCardsSection />
      <CalculatorWithProductSwitch />
      <AdvantagesSection
        title={home.advantages.title}
        subtitle={home.advantages.subtitle}
        items={home.advantages.items}
      />
      <StatsSection />
      <HowItWorksSection />
      <FaqSection items={generalFaq} />
      <TestimonialsSection />
      <PartnersSection />
      <ContactFormSection
        title={home.contactSection.title}
        subtitle={home.contactSection.subtitle}
      />
    </>
  );
}
