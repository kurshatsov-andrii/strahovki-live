import { Phone, Send } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ViberIcon } from "@/components/sections/contact";

export function MessengerLinks({ compact = false }: { compact?: boolean }) {
  const site = useSiteSettings();
  const cls = "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary hover:text-primary";
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "mt-3"}`}>
      <a href={site.viber_url} target="_blank" rel="noreferrer" className={cls}>
        <ViberIcon className="size-4 text-primary" /> Уточнити у Viber
      </a>
      <a href={site.telegram_url} target="_blank" rel="noreferrer" className={cls}>
        <Send className="size-4 text-primary" /> Telegram
      </a>
    </div>
  );
}

export function FloatingContact() {
  const site = useSiteSettings();
  const phoneHref = `tel:${site.phone_primary.replace(/[^+\d]/g, "")}`;
  const btn = "flex size-12 items-center justify-center rounded-full shadow-soft transition-transform hover:scale-105";
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a href={site.viber_url} target="_blank" rel="noreferrer" aria-label="Написати у Viber" className={`${btn} bg-primary text-primary-foreground`}>
        <ViberIcon className="size-6" />
      </a>
      <a href={site.telegram_url} target="_blank" rel="noreferrer" aria-label="Написати в Telegram" className={`${btn} bg-primary text-primary-foreground`}>
        <Send className="size-5" />
      </a>
      <a href={phoneHref} aria-label="Зателефонувати" className={`${btn} border border-border bg-background text-primary`}>
        <Phone className="size-5" />
      </a>
    </div>
  );
}
