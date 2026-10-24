import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { TestimonialsSection } from "@/components/sections/sections";
import { ContactFormSection } from "@/components/sections/contact";
import { breadcrumbScript } from "@/lib/jsonld";

const title = "Відгуки про страхування онлайн — клієнти Страховки";
const description =
  "Відгуки клієнтів у Google про автоцивілку, зелену карту, туристичне й спортивне страхування. Дізнайтеся про досвід оформлення полісів на сайті Страховки.";

export const Route = createFileRoute("/vidhuky")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://strahovki.kh.ua/vidhuky" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/vidhuky" }],
    scripts: [
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Відгуки", path: "/vidhuky" },
      ]),
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Що кажуть клієнти"
        title="Відгуки"
        subtitle="Реальні відгуки людей, які оформили страховку онлайн. Оцінки та коментарі з Google оновлюються автоматично."
      />
      <TestimonialsSection />
      <section className="bg-secondary/50 py-16">
        <div className="container-page mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Станьте наступним задоволеним клієнтом</h2>
          <p className="mt-4 text-muted-foreground">
            Оформіть поліс онлайн за кілька хвилин або напишіть мені — підберу найкращий варіант
            під вашу ситуацію.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Оформити страховку
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Зв'язатися зі мною
            </Link>
          </div>
        </div>
      </section>
      <ContactFormSection
        title="Залиште заявку"
        subtitle="Розкажіть, яка страховка вам потрібна, — відповім протягом кількох хвилин у робочий час."
      />
    </>
  );
}
