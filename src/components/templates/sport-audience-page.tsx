import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";
import { CtaCallSection } from "@/components/sections/cta-call";
import { breadcrumbScript } from "@/lib/jsonld";
import {
  sportAudiences,
  sportAudienceDescription,
  sportAudienceH1,
  sportAudienceTitle,
  type SportAudience,
} from "@/content/sport-audiences";

export function sportAudienceHead(a: SportAudience) {
  const title = sportAudienceTitle(a);
  const description = sportAudienceDescription(a);
  const url = `https://strahovki.kh.ua${a.path}`;
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
          name: `Страхування для ${a.gen}`,
          serviceType: "Спортивне страхування",
          url,
          areaServed: "UA",
          provider: { "@type": "InsuranceAgency", name: "Страховки" },
        }),
      },
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Спортивне страхування", path: "/sportyvne-strahuvannya" },
        { name: `Страхування для ${a.gen}`, path: a.path },
      ]),
    ],
  };
}

const btn =
  "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";

export function SportAudiencePage({ audience: a }: { audience: SportAudience }) {
  return (
    <>
      <PageHero
        eyebrow="Спортивне страхування"
        title={sportAudienceH1(a)}
        subtitle={`Страховка для аматорського спорту: страхова сума 35 000 грн, строк від 1 місяця до 1 року, електронний поліс онлайн.`}
      />
      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">Навіщо потрібна страховка для {a.gen}</h2>
            <p>
              Спортивна страховка покриває лікування травм, отриманих під час тренувань і
              аматорських змагань. Страхова сума — 35 000 грн, якої достатньо для обстеження,
              лікування та відновлення після типової спортивної травми.
            </p>
            <p>{a.note}</p>
            <h2 className="pt-4 text-2xl font-bold text-foreground">Вартість страхування для {a.gen}</h2>
            <p>
              Ціна залежить від групи ризику виду спорту та строку дії поліса — від 1 місяця до
              1 року, від 295 грн за місяць. Точну суму покаже калькулятор на сторінці спортивного
              страхування.
            </p>
            <h2 className="pt-4 text-2xl font-bold text-foreground">Як оформити страховку онлайн</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Оберіть вид спорту та строк дії поліса в калькуляторі.</li>
              <li>Заповніть дані спортсмена та залиште заявку.</li>
              <li>Після оплати електронний поліс EUROINS надійде на пошту.</li>
            </ol>
            <p>Вашу страховку оформлюю я особисто — Куршацов Андрій Іванович, страховий консультант.</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/sportyvne-strahuvannya" className={btn}>Оформити спортивну страховку</Link>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-lg font-bold">Страхування для інших видів спорту</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {sportAudiences.filter((x) => x.slug !== a.slug).map((x) => (
                <a key={x.slug} href={x.path} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                  Страхування для {x.gen}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ConsultantSection />
      <CtaCallSection />
      <ContactFormSection title={`Страхування для ${a.gen}`} subtitle="Залиште заявку — розрахую вартість і особисто оформлю ваш поліс." />
    </>
  );
}

export function SportAudiencesLinks() {
  return (
    <section className="py-12">
      <div className="container-page mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold">Страхування за видами спорту</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {sportAudiences.map((x) => (
            <a key={x.slug} href={x.path} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
              Страхування для {x.gen}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
