import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { navLinks, site as staticSite } from "@/content/site";
import { useSiteSettings } from "@/hooks/use-site-settings";
import logoAsset from "@/assets/logo-strahovki.jpg.asset.json";

export function SiteFooter() {
  const settings = useSiteSettings();
  return (
    <footer className="mt-auto border-t border-border bg-secondary/50">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold">
            <img
              src={logoAsset.url}
              alt="Логотип Страховки"
              width={40}
              height={40}
              className="size-10 rounded-xl object-cover"
            />
            {staticSite.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Онлайн-страхування авто, зелена карта, туристичне та спортивне страхування без візитів
            до офісу.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Продукти</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {navLinks.slice(0, 4).map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Контакти</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              <a href={`tel:${settings.phone_primary.replace(/[^+\d]/g, "")}`}>{settings.phone_primary}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              <a href={`tel:${settings.phone_secondary.replace(/[^+\d]/g, "")}`}>
                {settings.phone_secondary}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {settings.address}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Режим роботи</h3>
          <p className="mt-4 text-sm text-muted-foreground">{settings.working_hours}</p>
          <a
            href={settings.telegram_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm font-medium shadow-soft hover:text-primary"
          >
            <Send className="size-4" />
            Написати в Telegram
          </a>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-6 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {staticSite.name}. Усі права захищені.
          </span>
          <Link to="/admin" className="hover:text-primary">
            Адмінпанель
          </Link>
        </div>
      </div>
    </footer>
  );
}
