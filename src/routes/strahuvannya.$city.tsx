import { CtaCallSection } from "@/components/sections/cta-call";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";
import { getIcon } from "@/lib/icon-map";
import { breadcrumbScript } from "@/lib/jsonld";
import { cities, cityDescription, cityTitle, getCity } from "@/content/cities";

export const Route = createFileRoute("/strahuvannya/$city")({
  loader: ({ params }) => {
    const city = getCity(params.city);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Сторінку не знайдено" }, { name: "robots", content: "noindex" }] };
    const { city } = loaderData;
    const title = cityTitle(city);
    const description = cityDescription(city);
    const url = `https://strahovki.kh.ua/strahuvannya/${params.city}`;
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
        breadcrumbScript([
          { name: "Головна", path: "/" },
          { name: `Страхування ${city.inCity}`, path: `/strahuvannya/${params.city}` },
        ]),
      ],
    };
  },
  component: CityPage,
});

const products = [
  { icon: "Car", title: "Автоцивілка (ОСЦПВ)", to: "/autostrahuvannya", text: "Обов'язковий поліс для авто з українськими та іноземними номерами. Тарифи МТСБУ, пільги для пільгових категорій." },
  { icon: "Globe2", title: "Зелена карта", to: "/zelena-karta", text: "Страхування авто для виїзду за кордон — від 15 днів до 12 місяців. Електронний поліс одразу після оплати." },
  { icon: "PlaneTakeoff", title: "Туристичне страхування", to: "/turystychne-strahuvannya", text: "Медичне страхування за кордон на 30 000 € — Європа або Весь світ, від 7 до 90 днів." },
  { icon: "Trophy", title: "Спортивне страхування", to: "/sportyvne-strahuvannya", text: "Для аматорського спорту: страхова сума 35 000 грн, строк від 1 місяця до 1 року." },
] as const;

function CityPage() {
  const { city } = Route.useLoaderData();
  return (
    <>
      <PageHero
        eyebrow={city.region}
        title={`Страхування ${city.inCity}`}
        subtitle={`Автоцивілка, зелена карта, туристичне та спортивне страхування ${city.inCity} онлайн. Вашу страховку оформлюю я особисто.`}
      />
      <section className="py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">Страховий консультант для жителів міста {city.name}</h2>
            <p>
              Мене звати Куршацов Андрій Іванович, я страховий консультант. {city.note} Ви
              отримуєте не анонімний сервіс, а живу людину, яка підбере поліс, перевірить дані та
              буде на зв'язку, якщо станеться страховий випадок.
            </p>
            <p>
              Оформити страхування {city.inCity} можна повністю дистанційно: розрахуйте вартість
              на сайті, залиште заявку — і я надішлю посилання на оплату. Поліси є електронними,
              їх можна перевірити в базі МТСБУ, а надійність гарантують страхові компанії-партнери
              EUROINS та USG.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {products.map((p) => {
              const Icon = getIcon(p.icon);
              return (
                <div key={p.to} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex items-center gap-4">
                    <span className="bg-brand-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-bold leading-tight">{p.title} {city.inCity}</h3>
                  </div>
                  <p className="mt-4 flex-1 text-sm text-muted-foreground">{p.text}</p>
                  <Link
                    to={p.to}
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Оформити страховку
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-lg font-bold">Страхування в інших містах</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.filter((c) => c.slug !== city.slug).map((c) => (
                <Link key={c.slug} to="/strahuvannya/$city" params={{ city: c.slug }} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ConsultantSection />
      <CtaCallSection />
      <ContactFormSection
        title={`Оформити страховку ${city.inCity}`}
        subtitle="Залиште заявку — розрахую вартість і особисто оформлю ваш поліс."
      />
    </>
  );
}
