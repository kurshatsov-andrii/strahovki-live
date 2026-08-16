import { PageHero } from "@/components/sections/hero";
import {
  AdvantagesSection,
  FaqSection,
} from "@/components/sections/sections";

import { ContactFormSection } from "@/components/sections/contact";
import { InsuranceCalculator } from "@/components/calculator/insurance-calculator";
import { ConsultantSection } from "@/components/sections/consultant";
import { PolicyCheckSection } from "@/components/sections/policy-check";
import { CoverageSection } from "@/components/sections/coverage-section";
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

      <InsuranceCalculator product={product} />

      {content.coverage && <CoverageSection {...content.coverage} />}

      {(product === "auto" || product === "green_card") && (
        <PolicyCheckSection variant={product} />
      )}

      <ConsultantSection variant="compact" />

      <AdvantagesSection title={content.advantages.title} items={content.advantages.items} />
      <FaqSection items={content.faq} />

      <section className="py-20">
        <div className="container-page mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{content.description.title}</h2>
          <p className="mt-4 text-muted-foreground">{content.description.body}</p>
          <h2 className="mt-10 text-2xl font-extrabold sm:text-3xl">{content.seoText.title}</h2>
          <p className="mt-4 text-muted-foreground">{content.seoText.body}</p>
        </div>
      </section>

      <ContactFormSection
        title="Потрібна консультація?"
        subtitle="Залиште заявку — розрахуємо вартість і оформимо поліс."
      />
    </>
  );
}

