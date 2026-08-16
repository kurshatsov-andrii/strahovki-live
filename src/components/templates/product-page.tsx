import { PageHero } from "@/components/sections/hero";
import {
  AdvantagesSection,
  FaqSection,
} from "@/components/sections/sections";

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

      <ConsultantSection variant="compact" />

      <AdvantagesSection title={content.advantages.title} items={content.advantages.items} />

      {content.coverage && <CoverageSection {...content.coverage} />}

      {(product === "auto" || product === "green_card") && (
        <PolicyCheckSection variant={product} />
      )}

      <FaqSection items={content.faq} />

      <section className="pb-20">
        <div className="container-page mx-auto max-w-3xl">
          <details className="group rounded-2xl border border-border bg-card p-6 shadow-soft">
            <summary className="cursor-pointer list-none text-lg font-bold">
              Детальніше про {content.hero.title.toLowerCase()}
              <span className="ml-2 text-sm font-medium text-muted-foreground group-open:hidden">
                показати
              </span>
            </summary>
            <h3 className="mt-6 text-xl font-bold">{content.description.title}</h3>
            <p className="mt-3 text-muted-foreground">{content.description.body}</p>
            <h3 className="mt-8 text-xl font-bold">{content.seoText.title}</h3>
            <p className="mt-3 text-muted-foreground">{content.seoText.body}</p>
          </details>
        </div>
      </section>
    </>
  );
}
