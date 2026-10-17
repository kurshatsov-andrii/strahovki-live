import { Link } from "@tanstack/react-router";
import { Menu, Phone, Send, X } from "lucide-react";
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
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[14px] font-extrabold tracking-tight"
        >
          <img
            src={logoAsset.url}
            alt="Логотип Страховки"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-lg object-cover"
          />
          <span className="hidden min-[1180px]:inline">{staticSite.name}</span>
        </Link>

        <nav className="hidden items-center gap-0 min-[1180px]:flex">
          {navLinks.map((link) => (
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

        <div className="hidden items-center gap-1 min-[1180px]:flex">
          <nav className="flex items-center gap-0 border-r border-border/60 pr-1">
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="whitespace-nowrap rounded-lg px-1 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
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
          aria-label="Меню"
          className="flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
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
