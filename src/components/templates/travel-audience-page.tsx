import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";
import { CtaCallSection } from "@/components/sections/cta-call";
import { breadcrumbScript } from "@/lib/jsonld";
import { travelAudiences, type TravelAudience } from "@/content/travel-audiences";
import { travelCountries } from "@/content/travel-countries";

export function travelAudienceHead(a: TravelAudience) {
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
          serviceType: "Туристичне медичне страхування",
          url,
          areaServed: "UA",
          provider: { "@type": "InsuranceAgency", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Туристичне страхування", path: "/turystychne-strahuvannya" },
        { name: a.label, path: a.path },
      ]),
    ],
  };
}

const btn =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";
const chip = "rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary";

export function TravelAudiencePage({ audience: a }: { audience: TravelAudience }) {
  return (
    <>
      <PageHero eyebrow="Туристичне медичне страхування" title={a.h1} subtitle={a.subtitle} />
      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground">
            {a.paragraphs.map((p) => <p key={p}>{p}</p>)}
            <h2 className="pt-4 text-2xl font-bold text-foreground">Ціна страховки</h2>
            <p>
              Вартість залежить від кількості днів, віку та території дії поліса — від 293 грн за 7 днів,
              страхова сума €30 000. Точну суму покаже калькулятор.
            </p>
            <h2 className="pt-4 text-2xl font-bold text-foreground">Що варто знати</h2>
            <ul className="list-disc space-y-1 pl-5">
              {a.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <p>Вашу страховку оформлюю я особисто — Куршацов Андрій Іванович, страховий консультант.</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/turystychne-strahuvannya" className={btn}>Оформити страховку</Link>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-6">
            <div>
              <h2 className="text-lg font-bold">Інші види туристичної страховки</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {travelAudiences.filter((x) => x.path !== a.path).map((x) => (
                  <a key={x.path} href={x.path} className={chip}>Страховка {x.label.toLowerCase()}</a>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold">Страховка за країнами</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {travelCountries.map((x) => (
                  <a key={x.slug} href={x.path} className={chip}>{x.acc}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ConsultantSection />
      <CtaCallSection />
      <ContactFormSection title={a.h1} subtitle="Залиште заявку — розрахую вартість і особисто оформлю ваш поліс." />
    </>
  );
}

export function TravelAudiencesLinks() {
  return (
    <section className="py-12">
      <div className="container-page mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">Страховка за метою поїздки</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {travelAudiences.map((x) => (
            <a key={x.path} href={x.path} className={chip}>Страховка {x.label.toLowerCase()}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
