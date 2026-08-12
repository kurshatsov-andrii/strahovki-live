import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { submitLead } from "@/lib/quotes.functions";
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHead } from "@/components/sections/sections";

export function ContactInfoSection() {
  const site = useSiteSettings();
  const items = [
    { icon: Phone, label: "Телефони", value: `${site.phone_primary} · ${site.phone_secondary}` },
    { icon: Mail, label: "Email", value: site.email },
    { icon: MapPin, label: "Адреса", value: site.address },
    { icon: Clock, label: "Режим роботи", value: site.working_hours },
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
  const site = useSiteSettings();
  const submitFn = useServerFn(submitLead);
  const mutation = useMutation({
    mutationFn: (values: { name: string; phone: string; message: string }) =>
      submitFn({ data: { name: values.name, phone: values.phone, message: values.message } }),
    onSuccess: () => {
      setSent(true);
      toast.success("Заявку надіслано", {
        description: "Ми зв'яжемось з вами протягом кількох хвилин.",
      });
    },
    onError: () => toast.error("Не вдалося надіслати заявку. Спробуйте ще раз."),
  });

  return (
    <section className="bg-secondary/50 py-20">
      <div className="container-page">
        <SectionHead title={title} subtitle={subtitle} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-[1.2fr_1fr]">
          <form
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              mutation.mutate({
                name: String(data.get("name") ?? ""),
                phone: String(data.get("phone") ?? ""),
                message: String(data.get("message") ?? ""),
              });
              form.reset();
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
            <Button type="submit" className="mt-6 w-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
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
              href={site.telegram_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary"
            >
              <Send className="size-5 text-primary" />
              <span className="font-semibold">Написати в Telegram</span>
            </a>
            <a
              href={`tel:${site.phone_primary.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary"
            >
              <Phone className="size-5 text-primary" />
              <span className="font-semibold">{site.phone_primary}</span>
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
