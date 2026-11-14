import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";
import { CtaCallSection } from "@/components/sections/cta-call";
import { breadcrumbScript } from "@/lib/jsonld";
import {
  travelCountries,
  travelDescription,
  travelH1,
  travelTitle,
  type TravelCountry,
} from "@/content/travel-countries";

export function travelCountryHead(c: TravelCountry) {
  const title = travelTitle(c);
  const description = travelDescription(c);
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
          name: `Туристична страховка в ${c.acc}`,
          serviceType: "Туристичне медичне страхування",
          url,
          areaServed: "UA",
          provider: { "@type": "InsuranceAgency", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Туристичне страхування", path: "/turystychne-strahuvannya" },
        { name: `Страховка в ${c.acc}`, path: c.path },
      ]),
    ],
  };
}

const btn =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";

export function TravelCountryPage({ country: c }: { country: TravelCountry }) {
  return (
    <>
      <PageHero
        eyebrow="Туристичне медичне страхування"
        title={travelH1(c)}
        subtitle={`Медична страховка для виїзду в ${c.acc}: покриття €30 000, строк від 7 до 90 днів, електронний поліс онлайн.`}
      />
      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">Навіщо потрібна страховка в {c.acc}</h2>
            <p>
              Медична страховка для поїздки в {c.acc} оплачує лікування, якщо за кордоном ви захворіли
              або отримали травму: виклик лікаря, госпіталізацію, ліки та транспортування. Страхування
              в {c.acc} підходить для туристів, роботи та відпочинку.
            </p>
            <p>{c.note}</p>
            <p>
              Поліс діє не лише в {c.loc}, а на всій обраній території — «Європа» або «Весь світ».
              Країну вказуємо основну, де ви проведете більше днів.
            </p>
            <h2 className="pt-4 text-2xl font-bold text-foreground">Ціна страховки в {c.acc}</h2>
            <p>
              Вартість залежить від кількості днів, віку та території дії поліса. Туристична страховка
              — від 293 грн за 7 днів, страхова сума €30 000. Для мандрівників старше 70 років —
              індивідуальний розрахунок. Точну суму покаже калькулятор.
            </p>
            <h2 className="pt-4 text-2xl font-bold text-foreground">Як купити страховку в {c.acc} онлайн</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Оберіть дати поїздки — від 7 до 90 днів.</li>
              <li>Вкажіть дані мандрівника та номер Viber для посилання на оплату.</li>
              <li>Оплатіть — електронний поліс надійде на пошту.</li>
            </ol>
            <p>Вашу страховку оформлюю я особисто — Куршацов Андрій Іванович, страховий консультант.</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/turystychne-strahuvannya" className={btn}>Оформити страховку</Link>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-lg font-bold">Страховка в інші країни</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {travelCountries.filter((x) => x.slug !== c.slug).map((x) => (
                <a key={x.slug} href={x.path} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                  {x.acc}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ConsultantSection />
      <CtaCallSection />
      <ContactFormSection title={`Страховка в ${c.acc}`} subtitle="Залиште заявку — розрахую вартість і особисто оформлю ваш поліс." />
    </>
  );
}

export function TravelCountriesLinks() {
  return (
    <section className="py-12">
      <div className="container-page mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">Страхування за країнами</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {travelCountries.map((x) => (
            <a key={x.slug} href={x.path} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
              Страховка в {x.acc}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
