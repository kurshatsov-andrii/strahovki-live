import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";
import { CtaCallSection } from "@/components/sections/cta-call";
import { breadcrumbScript } from "@/lib/jsonld";
import {
  greenCardCountries,
  greenCardDescription,
  greenCardH1,
  greenCardTitle,
  type GreenCardCountry,
} from "@/content/green-card-countries";

export function greenCardCountryHead(c: GreenCardCountry) {
  const title = greenCardTitle(c);
  const description = greenCardDescription(c);
  const url = `https://strahovki.kh.ua${c.path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
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
          name: `Зелена карта для ${c.gen}`,
          serviceType: "Зелена карта",
          url,
          areaServed: "UA",
          provider: { "@type": "InsuranceAgency", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Зелена карта", path: "/zelena-karta" },
        { name: `Зелена карта для ${c.gen}`, path: c.path },
      ]),
    ],
  };
}

const btn =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";

export function GreenCardCountryPage({ country: c }: { country: GreenCardCountry }) {
  return (
    <>
      <PageHero
        eyebrow="Міжнародне автострахування"
        title={greenCardH1(c)}
        subtitle={`Страховка на авто для ${c.gen}: розрахунок ціни, вибір терміну від 15 днів до 12 місяців та електронний поліс онлайн.`}
      />
      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">Навіщо потрібна зелена карта для {c.gen}</h2>
            <p>
              Зелена карта — це міжнародний поліс обов'язкового страхування цивільної
              відповідальності власника авто. Без нього виїзд на власному автомобілі {c.to} неможливий:
              поліс покриває збитки, завдані іншим учасникам руху за кордоном.
            </p>
            <p>{c.note}</p>
            <h2 className="pt-4 text-2xl font-bold text-foreground">Зелена карта: ціна для поїздки {c.to}</h2>
            <p>
              Вартість залежить від типу транспортного засобу та терміну дії поліса — від 15 днів до
              1 року. Ціна для легкового авто — від 681 грн за 15 днів. Точну суму покаже
              калькулятор на сторінці зеленої карти.
            </p>
            <h2 className="pt-4 text-2xl font-bold text-foreground">Як оформити зелену карту онлайн</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Розрахуйте вартість і оберіть термін страхування.</li>
              <li>Заповніть дані власника та авто латиницею, як у техпаспорті.</li>
              <li>Оплатіть — електронний поліс USG надійде на пошту, його можна перевірити в базі МТСБУ.</li>
            </ol>
            <p>Вашу страховку оформлюю я особисто — Куршацов Андрій Іванович, страховий консультант.</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/zelena-karta" className={btn}>Оформити зелену карту</Link>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-lg font-bold">Зелена карта для інших країн</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {greenCardCountries.filter((x) => x.slug !== c.slug).map((x) => (
                <a key={x.slug} href={x.path} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                  {x.gen.replace(/и$|і$/, (m) => m)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ConsultantSection />
      <CtaCallSection />
      <ContactFormSection title={`Зелена карта для ${c.gen}`} subtitle="Залиште заявку — розрахую вартість і особисто оформлю ваш поліс." />
    </>
  );
}

export function GreenCardCountriesLinks() {
  return (
    <section className="py-12">
      <div className="container-page mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">Зелена карта за країнами</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {greenCardCountries.map((x) => (
            <a key={x.slug} href={x.path} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
              Зелена карта для {x.gen}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
