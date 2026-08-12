import { useState } from "react";
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import { SectionHead } from "@/components/sections/sections";

export function ContactInfoSection() {
  const items = [
    { icon: Phone, label: "Телефони", value: `${site.phonePrimary} · ${site.phoneSecondary}` },
    { icon: Mail, label: "Email", value: site.email },
    { icon: MapPin, label: "Адреса", value: site.address },
    { icon: Clock, label: "Режим роботи", value: site.workingHours },
  ];

  return (
    <section className="py-20">
      <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <item.icon className="size-5 text-primary" />
            <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {item.label}
            </div>
            <div className="mt-1 font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactFormSection({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-secondary/50 py-20">
      <div className="container-page">
        <SectionHead title={title} subtitle={subtitle} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-[1.2fr_1fr]">
          <form
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Заявку надіслано", {
                description: "Ми зв'яжемось з вами протягом кількох хвилин.",
              });
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ім'я</Label>
                <Input id="name" name="name" required placeholder="Ваше ім'я" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" name="phone" required type="tel" placeholder="+38 (0__) ___-__-__" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="message">Повідомлення</Label>
              <Textarea id="message" name="message" rows={4} placeholder="Який продукт вас цікавить?" />
            </div>
            <Button type="submit" className="mt-6 w-full">
              Залишити заявку
            </Button>
            {sent && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Дякуємо! Ми отримали ваш запит.
              </p>
            )}
          </form>

          <div className="flex flex-col gap-3">
            <a
              href={site.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary"
            >
              <Send className="size-5 text-primary" />
              <span className="font-semibold">Написати в Telegram</span>
            </a>
            <a
              href={`tel:${site.phonePrimary.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary"
            >
              <Phone className="size-5 text-primary" />
              <span className="font-semibold">{site.phonePrimary}</span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary"
            >
              <Mail className="size-5 text-primary" />
              <span className="font-semibold">{site.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
