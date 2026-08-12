import { Link } from "@tanstack/react-router";
import { Menu, Phone, Send, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { navLinks, site as staticSite } from "@/content/site";
import { useSiteSettings } from "@/hooks/use-site-settings";
import logoAsset from "@/assets/logo-strahovki.jpg.asset.json";

export function SiteHeader() {
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <img
            src={logoAsset.url}
            alt="Логотип Страховки"
            width={40}
            height={40}
            className="size-10 rounded-xl object-cover"
          />
          {staticSite.name}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${settings.phone_primary.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <Phone className="size-4 text-primary" />
            {settings.phone_primary}
          </a>
          <a
            href={settings.telegram_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Send className="size-4" />
          </a>
          <Button asChild>
            <Link to="/autostrahuvannya">Оформити страховку</Link>
          </Button>
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
            <a
              href={`tel:${settings.phone_primary.replace(/[^+\d]/g, "")}`}
              className="rounded-lg px-3 py-3 text-sm font-semibold"
            >
              {settings.phone_primary}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
