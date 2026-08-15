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
import { FieldError } from "@/components/ui/field-error";
import { contactLeadSchema, fieldErrors } from "@/lib/lead-validation";

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.02 1.5C6.2 1.5 1.5 5.74 1.5 11.03c0 1.85.56 3.63 1.6 5.16L1.5 22.5l6.6-1.52a9.62 9.62 0 0 0 3.92.83c5.82 0 10.52-4.24 10.52-9.53S17.84 1.5 12.02 1.5Zm5.7 6.93c.06 1.4-.36 2.7-1.18 3.78a6.12 6.12 0 0 1-3.1 2.16c-1.06.36-2.18.5-3.3.4-.24-.02-.47.1-.57.32l-.57 1.36a.44.44 0 0 1-.42.27.44.44 0 0 1-.26-.09l-1.68-1.2a.5.5 0 0 1-.2-.5l.28-1.18c.06-.24-.04-.5-.26-.62a5.32 5.32 0 0 1-2.2-2.12 5.53 5.53 0 0 1-.7-3.16c.16-1.6.9-3 2.12-4 1.3-1.08 2.94-1.58 4.64-1.42 2.04.18 3.84 1.08 5.08 2.54.9 1.06 1.4 2.38 1.46 3.78v.15Zm-2.02.06c-.04-.98-.36-1.86-.96-2.56a4.78 4.78 0 0 0-3.54-1.76c-1.24-.1-2.42.24-3.34.96a4.16 4.16 0 0 0-1.52 2.78 4.45 4.45 0 0 0 .52 2.48 4.05 4.05 0 0 0 1.6 1.56c.22.12.32.38.24.62l-.18.76 1.06.76.42-1c.1-.22.32-.36.56-.34 1.24.1 2.42-.2 3.36-.86a4.22 4.22 0 0 0 1.74-2.6Zm-2.14 2.58c-.08.1-.2.14-.32.1-.12-.04-.2-.16-.2-.28 0-.08.02-.14.08-.2.16-.18.3-.38.42-.6.04-.08.12-.14.22-.16.1-.02.2.02.26.1.08.1.08.24 0 .34-.14.26-.32.5-.5.7h.04Zm1.14-1.2c-.1.12-.26.18-.42.14-.14-.04-.24-.18-.24-.34 0-.08.04-.16.1-.22.24-.28.46-.58.62-.9.06-.1.16-.16.28-.18.1 0 .22.04.28.14.1.12.1.3 0 .42-.2.36-.42.7-.68 1h.06Zm-3.18 1.46c-.1.12-.26.18-.42.14-.14-.04-.24-.18-.24-.34 0-.08.04-.16.1-.22.24-.28.46-.58.62-.9.06-.1.16-.16.28-.18.1 0 .22.04.28.14.1.12.1.3 0 .42-.2.36-.42.7-.68 1h.06Zm1.02-1.22c-.1.12-.26.18-.42.14-.14-.04-.24-.18-.24-.34 0-.08.04-.16.1-.22.24-.28.46-.58.62-.9.06-.1.16-.16.28-.18.1 0 .22.04.28.14.1.12.1.3 0 .42-.2.36-.42.7-.68 1h.06Z" />
    </svg>
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const site = useSiteSettings();
  const submitFn = useServerFn(submitLead);
  const mutation = useMutation({
    mutationFn: (values: { name: string; phone: string; email: string; message: string }) =>
      submitFn({
        data: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          message: values.message,
        },
      }),
    onSuccess: () => {
      setSent(true);
      setErrors({});
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
            noValidate
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              const parsed = contactLeadSchema.safeParse({
                name: String(data.get("name") ?? ""),
                phone: String(data.get("phone") ?? ""),
                email: String(data.get("email") ?? ""),
                message: String(data.get("message") ?? ""),
              });
              if (!parsed.success) {
                setErrors(fieldErrors(parsed.error));
                toast.error("Перевірте правильність заповнення полів");
                return;
              }
              setErrors({});
              mutation.mutate({
                name: parsed.data.name,
                phone: parsed.data.phone,
                email: parsed.data.email,
                message: parsed.data.message ?? "",
              });
              form.reset();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ім'я</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ваше ім'я"
                  aria-invalid={Boolean(errors["name"])}
                />
                <FieldError message={errors["name"]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+38 (0__) ___-__-__"
                  aria-invalid={Boolean(errors["phone"])}
                />
                <FieldError message={errors["phone"]} />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors["email"])}
              />
              <FieldError message={errors["email"]} />
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="message">Повідомлення</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Який продукт вас цікавить?"
                aria-invalid={Boolean(errors["message"])}
              />
              <FieldError message={errors["message"]} />
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
              href={site.viber_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft hover:border-primary"
            >
              <ViberIcon className="size-5 text-primary" />
              <span className="font-semibold">Viber +380664688151</span>
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
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <MapPin className="size-5 text-primary" />
              <span className="font-semibold">{site.address}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <Clock className="size-5 text-primary" />
              <span className="font-semibold">{site.working_hours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
