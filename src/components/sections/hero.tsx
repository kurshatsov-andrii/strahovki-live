import { Link } from "@tanstack/react-router";
import { Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import heroImage from "@/assets/hero-drive.jpg";

export function HomeHero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
}) {
  return (
    <section className="bg-navy-gradient relative overflow-hidden">
      <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3 py-1.5 text-xs font-semibold text-navy-foreground/80">
            <ShieldCheck className="size-4 text-accent" />
            {eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-navy-foreground sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-navy-foreground/75 sm:text-lg">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to={primary.to}>{primary.label}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground">
              <Link to={secondary.to}>{secondary.label}</Link>
            </Button>
          </div>
          <a
            href={`tel:${site.phonePrimary.replace(/[^+\d]/g, "")}`}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-foreground/80 hover:text-navy-foreground"
          >
            <Phone className="size-4 text-accent" />
            {site.phonePrimary}
          </a>
        </div>

        <div className="relative">
          <img
            src={heroImage}
            alt="Подорож автомобілем із чинним страховим полісом"
            width={1280}
            height={960}
            className="w-full rounded-3xl object-cover shadow-lift"
          />
        </div>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="bg-navy-gradient">
      <div className="container-page max-w-3xl py-20 text-center lg:py-24">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold text-navy-foreground sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-navy-foreground/75">{subtitle}</p>
      </div>
    </section>
  );
}
