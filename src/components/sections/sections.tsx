import { Link } from "@tanstack/react-router";
import { Check, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import type { Advantage, FaqItem } from "@/content/site";
import { home } from "@/content/site";

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  invert,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  invert?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-3 text-3xl font-extrabold sm:text-4xl ${invert ? "text-navy-foreground" : ""}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base ${invert ? "text-navy-foreground/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ServiceCardsSection() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHead
          eyebrow="Наші продукти"
          title="Оберіть страховий продукт"
          subtitle="Чотири напрямки страхування з онлайн-оформленням та електронним полісом."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.serviceCards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <article
                key={card.to}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="bg-brand-gradient flex size-12 items-center justify-center rounded-xl text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {card.benefits.map((b) => (
                    <li key={b} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="secondary" className="mt-6 w-full">
                  <Link to={card.to}>Детальніше</Link>
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AdvantagesSection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: Advantage[];
}) {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container-page">
        <SectionHead title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.title} className="rounded-2xl bg-card p-6 shadow-soft">
                <Icon className="size-6 text-primary" />
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-16">
      <div className="container-page">
        <div className="bg-navy-gradient grid gap-8 rounded-3xl px-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {home.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-navy-foreground sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-navy-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHead title={home.howItWorks.title} subtitle={home.howItWorks.subtitle} />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.howItWorks.steps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container-page">
        <SectionHead title="Часті запитання" />
        <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-left font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHead title={home.testimonials.title} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {home.testimonials.items.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm text-muted-foreground">{t.text}</blockquote>
              <figcaption className="mt-5 text-sm font-semibold">
                {t.name}
                <span className="ml-2 font-normal text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnersSection() {
  return (
    <section className="border-y border-border bg-secondary/40 py-14">
      <div className="container-page">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {home.partners.title}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {home.partners.items.map((name) => (
            <div
              key={name}
              className="flex h-16 items-center justify-center rounded-xl bg-card text-sm font-bold text-muted-foreground shadow-soft"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeoTextSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="py-20">
      <div className="container-page mx-auto max-w-3xl">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
        <p className="mt-4 text-muted-foreground">{body}</p>
      </div>
    </section>
  );
}
