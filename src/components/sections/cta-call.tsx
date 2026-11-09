import { Calculator, SlidersHorizontal, MonitorSmartphone, Handshake, Phone, Send } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ViberIcon } from "@/components/sections/contact";

const benefits = [
  { icon: Calculator, text: "Індивідуальний розрахунок вартості" },
  { icon: SlidersHorizontal, text: "Підбір страхування під ваші потреби" },
  { icon: MonitorSmartphone, text: "Допомога з оформленням онлайн" },
  { icon: Handshake, text: "Супровід від консультації до отримання страхового поліса" },
];

export function CtaCallSection() {
  const site = useSiteSettings();
  const phoneHref = `tel:${site.phone_primary.replace(/[^+\d]/g, "")}`;

  return (
    <section className="py-20">
      <div className="container-page">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-8 shadow-soft md:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Потрібна точна вартість страхування?</h2>
            <p className="mt-3 text-lg font-semibold text-primary">
              Допоможемо підібрати найкращий варіант!
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Напишіть нам або зателефонуйте. Проконсультуємо, відповімо на ваші запитання та
              підберемо страхування відповідно до ваших потреб.
            </p>
          </div>

          <ul className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="pt-1.5 text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-border pt-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Зв'яжіться з нами зручним способом
            </p>
            <a
              href={phoneHref}
              className="mt-3 inline-block text-3xl font-bold tracking-tight text-foreground transition-colors hover:text-primary md:text-4xl"
            >
              {site.phone_primary}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              Телефонуйте або пишіть у месенджери — Viber чи Telegram.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={site.viber_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
              >
                <ViberIcon className="size-5" />
                Написати у Viber
              </a>
              <a
                href={site.telegram_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-semibold shadow-soft transition-colors hover:border-primary hover:text-primary"
              >
                <Send className="size-5 text-primary" />
                Написати в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
