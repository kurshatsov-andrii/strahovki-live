import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { getIcon } from "@/lib/icon-map";

const title = "Ціни на страхування 2026 — автоцивілка, зелена карта, туристичне, спортивне";
const description =
  "Актуальні ціни на страховки онлайн: автоцивілка від 2045 грн на рік, зелена карта від 1050 грн, туристичне страхування від 293 грн за тиждень, спортивне страхування від 295 грн. Розрахуйте точну вартість у калькуляторі.";


export const Route = createFileRoute("/tsiny")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.kh.ua/tsiny" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/tsiny" }],
  }),
  component: PricesPage,
});

const priceCards = [
  {
    icon: "Car",
    title: "Автоцивілка (ОСЦПВ)",
    price: "від 2 045 грн / рік",
    to: "/autostrahuvannya",
    points: [
      "Тарифи за правилами МТСБУ",
      "Ціна залежить від регіону реєстрації та типу авто",
      "Пільгові категорії — зі знижкою",
      "Окремі тарифи для авто на іноземних номерах",
    ],
  },
  {
    icon: "Globe2",
    title: "Зелена карта",
    price: "від 1 050 грн",
    to: "/zelena-karta",
    points: [
      "Термін від 15 днів до 12 місяців",
      "Ціна залежить від типу авто та терміну",
      "Електронний поліс одразу після оплати",
      "Діє в усіх країнах системи «Зелена карта»",
    ],
  },
  {
    icon: "PlaneTakeoff",
    title: "Туристичне страхування",
    price: "від 293 грн / 7 днів",
    to: "/turystychne-strahuvannya",
    points: [
      "Покриття 30 000 € за замовчуванням",
      "Територія: Європа або Весь світ",
      "Термін від 7 до 90 днів",
      "Для мандрівників 70+ — індивідуальний розрахунок",
    ],
  },
  {
    icon: "Trophy",
    title: "Спортивне страхування",
    price: "від 295 грн / місяць",
    to: "/sportyvne-strahuvannya",
    points: [
      "Страхова сума 35 000 грн",
      "Термін дії — від 1 місяця до 1 року",
      "Для аматорського спорту",

      "Підходить для тренувань і змагань",
    ],
  },
] as const;

function PricesPage() {
  return (
    <>
      <PageHero
        eyebrow="Прозорі тарифи"
        title="Ціни на страхування"
        subtitle="Орієнтовна вартість кожного продукту. Точну ціну під вашу ситуацію порахує калькулятор — це займе менше хвилини."
      />
      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2">
            {priceCards.map((card) => {
              const Icon = getIcon(card.icon);
              return (
                <div
                  key={card.to}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-brand-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-bold leading-tight">{card.title}</h2>
                      <p className="mt-1 text-sm font-semibold text-primary">{card.price}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={card.to}
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Розрахувати точну вартість
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
            Ціни на сайті актуальні та відповідають тарифам страхових компаній-партнерів. Якщо у
            вас нестандартна ситуація — напишіть мені, порахую індивідуально.
          </p>
        </div>
      </section>
      <ContactFormSection
        title="Потрібна точна ціна?"
        subtitle="Залиште заявку — розрахую вартість під ваші параметри та відповім протягом кількох хвилин."
      />
    </>
  );
}
