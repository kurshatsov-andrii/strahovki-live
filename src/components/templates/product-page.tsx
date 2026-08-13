import { PageHero } from "@/components/sections/hero";
import {
  AdvantagesSection,
  FaqSection,
  HowItWorksSection,
  SeoTextSection,
} from "@/components/sections/sections";
import { ContactFormSection } from "@/components/sections/contact";
import { InsuranceCalculator } from "@/components/calculator/insurance-calculator";
import { ConsultantSection } from "@/components/sections/consultant";
import type { ProductPageContent } from "@/content/site";
import type { ProductKey } from "@/lib/insurance";

export function ProductPage({
  content,
  product,
}: {
  content: ProductPageContent;
  product: ProductKey;
}) {
  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <section className="py-20">
        <div className="container-page mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{content.description.title}</h2>
          <p className="mt-4 text-muted-foreground">{content.description.body}</p>
        </div>
      </section>

      <InsuranceCalculator product={product} />

      <ConsultantSection variant="compact" />

      <AdvantagesSection title={content.advantages.title} items={content.advantages.items} />
      <HowItWorksSection />
      <FaqSection items={content.faq} />
      <SeoTextSection title={content.seoText.title} body={content.seoText.body} />
      <ContactFormSection
        title="Потрібна консультація?"
        subtitle="Залиште заявку — розрахуємо вартість і оформимо поліс."
      />
    </>
  );
}
