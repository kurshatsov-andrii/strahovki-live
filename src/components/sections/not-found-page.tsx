import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  Contact,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { home, site } from "@/content/site";
import { getIcon } from "@/lib/icon-map";

const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

const quickLinks = [
  { to: "/", label: "Головна сторінка", description: "Розрахунок і оформлення будь-якого поліса" },
  { to: "/#products", label: "Усі страхові послуги", description: "Чотири продукти з актуальними тарифами" },
  { to: "/blog", label: "Блог про страхування", description: "Пояснення, поради та розбори ситуацій" },
  { to: "/contacts", label: "Контакти", description: "Телефон, Telegram, Viber та адреси" },
];

export function NotFoundPage() {
  return (
    <>
      <section className="bg-navy-gradient relative overflow-hidden">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3 py-1.5 text-xs font-semibold text-navy-foreground/80">
              <Compass className="size-4 text-accent" />
              Помилка 404
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-navy-foreground sm:text-5xl">
              Сторінку не знайдено
            </h1>
            <p className="mt-5 max-w-xl text-base text-navy-foreground/75 sm:text-lg">
              Можливо, адресу сторінки змінили, матеріал перенесли або в посиланні сталася
              помилка. Це не проблема: нижче зібрані всі наші страхові послуги, а я завжди на
              зв'язку, щоб підібрати поліс під вашу ситуацію.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/">На головну сторінку</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
              >
                <a href={site.telegramUrl} target="_blank" rel="noreferrer">
                  <Send className="size-4" /> Написати в Telegram
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={telHref(site.phonePrimary)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-foreground/80 hover:text-navy-foreground"
              >
                <Phone className="size-4 text-accent" />
                {site.phonePrimary}
              </a>
              <a
                href={telHref(site.phoneSecondary)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-foreground/80 hover:text-navy-foreground"
              >
                <Phone className="size-4 text-accent" />
                {site.phoneSecondary}
              </a>
            </div>
          </div>

          <div className="relative hidden items-center justify-center lg:flex">
            <span
              aria-hidden
              className="bg-brand-bright-gradient absolute size-64 rounded-full opacity-25 blur-3xl"
            />
            <span className="bg-brand-bright-gradient relative bg-clip-text text-[9rem] font-extrabold leading-none text-transparent lg:text-[11rem]">
              404
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Оберіть страховий продукт
            </span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Оформіть поліс за кілька хвилин
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Розрахунок на сайті, заявка без візиту в офіс і електронний поліс на email або в
              Telegram. Оберіть послугу нижче.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {home.serviceCards.map((card) => {
              const Icon = getIcon(card.icon);
              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="bg-brand-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-bold leading-tight">{card.title}</h3>
                  <p className="mt-1.5 grow text-sm text-muted-foreground">{card.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Розрахувати вартість
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
              <Sparkles className="size-4 text-primary" />
              Живий консультант
            </span>
            <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
              Не знайшли потрібну сторінку?
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Напишіть мені напряму. Я, Куршацов Андрій, страховий консультант: підкажу, який
              поліс потрібен саме вам, порахую вартість і оформлю документ онлайн — автоцивілку,
              зелену карту, туристичну або спортивну страховку.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button asChild>
                <a href={site.telegramUrl} target="_blank" rel="noreferrer">
                  <Send className="size-4" /> Telegram
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={telHref(site.phonePrimary)}>
                  <Phone className="size-4" /> Подзвонити
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={site.viberUrl}>
                  <MessageCircle className="size-4" /> Viber
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <p className="inline-flex items-center gap-2 text-sm font-bold">
              <Contact className="size-4 text-primary" />
              Куди перейти
            </p>
            <ul className="mt-4 flex flex-col">
              {quickLinks.map((link, index) => (
                <li key={link.label}>
                  {index > 0 && <span aria-hidden className="mx-5 block h-px bg-border" />}
                  {link.to.startsWith("/#") ? (
                    <a
                      href={link.to}
                      className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/70"
                    >
                      <span>
                        <span className="block text-sm font-semibold">{link.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {link.description}
                        </span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/70"
                    >
                      <span>
                        <span className="block text-sm font-semibold">{link.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {link.description}
                        </span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
