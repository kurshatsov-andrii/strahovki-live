import { Link, ClientOnly } from "@tanstack/react-router";
import { Check, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import type { Advantage, FaqItem } from "@/content/site";
import { home } from "@/content/site";
import { useEffect, useRef } from "react";

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  invert,
}: {
  eyebrow?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  invert?: boolean | undefined;
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
    <section id="products" className="py-16">
      <div className="container-page">
        <SectionHead title="Оберіть страховий продукт" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.serviceCards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="bg-brand-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span>
                  <h3 className="font-bold leading-tight">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{card.description}</p>
                </span>
              </Link>
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
  withStats,
}: {
  title: string;
  subtitle?: string;
  items: Advantage[];
  withStats?: boolean;
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
        {withStats && (
          <div className="mt-8 grid gap-6 rounded-2xl border border-border bg-card px-6 py-6 sm:grid-cols-4">
            {home.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="container-page">
        <SectionHead title={home.howItWorks.title} subtitle={home.howItWorks.subtitle} />
        <ol className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {home.howItWorks.steps.map((step, i) => (
            <li key={step.title} className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              <span>
                <h3 className="font-bold leading-tight">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </span>
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
        <div
          className="trustindex-widget mt-12 min-h-[180px]"
          data-widget-id="2cfbe9733f7d250d9a16cb73dca"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<script defer async src="https://cdn.trustindex.io/loader.js?2cfbe9733f7d250d9a16cb73dca"></script>`,
          }}
        />
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
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {home.partners.items.map((name) => (
            <div
              key={name}
              className="flex h-16 w-full items-center justify-center rounded-xl bg-card text-sm font-bold text-muted-foreground shadow-soft sm:w-64"
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
