import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";
import { CtaCallSection } from "@/components/sections/cta-call";
import { autoAudiences, type AutoAudience } from "@/content/auto-audiences";
import { breadcrumbScript } from "@/lib/jsonld";

export function autoAudienceHead(a: AutoAudience) {
  const url = `https://strahovki.kh.ua${a.path}`;
  return {
    meta: [
      { title: a.title },
      { name: "description", content: a.description },
      { property: "og:title", content: a.title },
      { property: "og:description", content: a.description },
      { name: "twitter:title", content: a.title },
      { name: "twitter:description", content: a.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: a.h1,
          serviceType: "Автоцивілка (ОСЦПВ)",
          url,
          areaServed: "UA",
          provider: { "@type": "InsuranceAgency", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Автоцивілка (ОСЦПВ)", path: "/autostrahuvannya" },
        { name: a.h1, path: a.path },
      ]),
    ],
  };
}

const primaryButton =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";
const secondaryButton =
  "inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary";

export function AutoAudiencePage({ audience: a }: { audience: AutoAudience }) {
  return (
    <>
      <PageHero eyebrow="Автоцивілка (ОСЦПВ)" title={a.h1} subtitle={a.subtitle} />

      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground">
            {a.sections.map((section) => (
              <div key={section.title} className="space-y-4 pb-4">
                <h2 className="pt-4 text-2xl font-bold text-foreground">{section.title}</h2>
                {"bullets" in section && section.bullets && (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ))}

            <p className="pt-4">
              Вашу страховку оформлюю я особисто — Куршацов Андрій Іванович, страховий консультант.
              Допоможу правильно заповнити дані та перевірю реквізити перед оплатою.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/autostrahuvannya" className={primaryButton}>
                Розрахувати вартість
              </Link>
              <Link
                to="/blog/kategoriia/$category"
                params={{ category: "avtotsyvilka" }}
                className={secondaryButton}
              >
                Корисні статті про автоцивілку
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-lg font-bold">Інші варіанти автоцивілки</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {autoAudiences
                .filter((x) => x.slug !== a.slug)
                .map((x) => (
                  <Link
                    key={x.slug}
                    to={x.path}
                    className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                  >
                    {x.h1}
                  </Link>
                ))}
            </div>
            {(a.slug === "inozemna-reiestratsiia") && (
              <p className="mt-5 text-muted-foreground">
                Плануєте поїздку за кордон на авто з українською реєстрацією?{" "}
                <Link to="/zelena-karta" className="font-semibold text-primary hover:underline">
                  Оформіть «Зелену карту» онлайн
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      <ConsultantSection />
      <CtaCallSection />
      <ContactFormSection
        title={a.h1}
        subtitle="Залиште заявку — розрахую вартість і особисто допоможу оформити ваш поліс."
      />
    </>
  );
}

export function AutoAudiencesLinks() {
  return (
    <section className="py-12">
      <div className="container-page mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">Автоцивілка для вашої ситуації</h2>
        <p className="mt-3 text-muted-foreground">
          Оберіть тему, щоб дізнатися про тарифи, необхідні дані та порядок онлайн-оформлення.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {autoAudiences.map((x) => (
            <Link
              key={x.slug}
              to={x.path}
              className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              {x.h1}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
