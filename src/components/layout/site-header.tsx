import { Link } from "@tanstack/react-router";
import { ChevronRight, Menu, Phone, Send, X } from "lucide-react";
import { useState } from "react";
import { navLinks, secondaryNavLinks, site as staticSite } from "@/content/site";
import { useSiteSettings } from "@/hooks/use-site-settings";
import logoAsset from "@/assets/logo-strahovki.jpg.asset.json";

export function SiteHeader() {
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
          <img
            src={logoAsset.url}
            alt="Логотип Страховки"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-lg object-cover"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[14px] font-extrabold tracking-tight">
              {staticSite.name}
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-wide text-muted-foreground min-[1180px]:hidden">
              Оберіть послугу
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0 min-[1180px]:flex">
          {[...navLinks, ...secondaryNavLinks].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="whitespace-nowrap rounded-lg px-1.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 border-l border-border/60 pl-2 min-[1180px]:flex">
          <a

            href={`tel:${settings.phone_primary.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-1 whitespace-nowrap rounded-lg px-0.5 py-1.5 text-[13px] font-semibold hover:bg-secondary"
          >
            <Phone className="size-3.5 shrink-0 text-primary" />
            {settings.phone_primary}
          </a>
          <a
            href={`tel:${settings.phone_secondary.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-1 whitespace-nowrap rounded-lg px-0.5 py-1.5 text-[13px] font-semibold hover:bg-secondary"
          >
            <Phone className="size-3.5 shrink-0 text-primary" />
            {settings.phone_secondary}
          </a>
          <a
            href={settings.telegram_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Send className="size-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Закрити меню" : "Відкрити меню з переліком послуг"}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-secondary/60 py-2 pr-1.5 pl-2.5 text-[13px] font-semibold min-[1180px]:hidden"
        >
          {open ? (
            <>
              <X className="size-4" />
              <span>Закрити</span>
            </>
          ) : (
            <>
              <Menu className="size-4 text-primary" />
              <span>Меню</span>
              <ChevronRight className="header-nudge size-4 text-primary" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background min-[1180px]:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Оберіть послугу
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${settings.phone_primary.replace(/[^+\d]/g, "")}`}
              className="rounded-lg px-3 py-3 text-sm font-semibold"
            >
              {settings.phone_primary}
            </a>
            <a
              href={`tel:${settings.phone_secondary.replace(/[^+\d]/g, "")}`}
              className="rounded-lg px-3 py-3 text-sm font-semibold"
            >
              {settings.phone_secondary}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
