import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ConsultantSection } from "@/components/sections/consultant";
import { AdvantagesSection } from "@/components/sections/sections";
import { ContactFormSection } from "@/components/sections/contact";
import { home } from "@/content/site";

const title = "Про мене — Куршацов Андрій, страховий консультант у Харкові";
const description =
  "Куршацов Андрій Іванович — страховий консультант у Харкові. Автоцивілка, зелена карта, туристичне та спортивне страхування онлайн. Персональний супровід кожного клієнта.";

export const Route = createFileRoute("/pro-mene")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.kh.ua/pro-mene" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/pro-mene" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Ваш персональний консультант"
        title="Про мене"
        subtitle="Мене звати Куршацов Андрій Іванович. Я страховий консультант і допомагаю оформлювати страховки онлайн — швидко, прозоро і без візитів до офісу."
      />
      <ConsultantSection />
      <section className="py-16">
        <div className="container-page mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Чим я можу бути корисним</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Я працюю з провідними страховими компаніями України та допомагаю підібрати поліс під
              вашу ситуацію: автоцивілку для авто, зелену карту для виїзду за кордон, туристичне
              медичне страхування для подорожей та спортивне страхування для тренувань і змагань.
            </p>
            <p>
              Мій принцип — жодних прихованих доплат і «дрібного шрифту». Ви завжди знаєте, що
              саме покриває ваш поліс, скільки він коштує і як діяти у разі страхового випадку.
            </p>
            <p>
              Після оформлення я залишаюся на зв'язку: підкажу, як перевірити поліс у базі МТСБУ,
              що робити при ДТП або якщо знадобилася медична допомога за кордоном.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contacts"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Зв'язатися зі мною
            </Link>
            <Link
              to="/tsiny"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Переглянути ціни
            </Link>
          </div>
        </div>
      </section>
      <AdvantagesSection
        title={home.advantages.title}
        subtitle={home.advantages.subtitle}
        items={home.advantages.items}
        withStats
      />
      <ContactFormSection
        title="Поставте запитання"
        subtitle="Напишіть, яка страховка вам потрібна, — відповім протягом кількох хвилин у робочий час."
      />
    </>
  );
}
