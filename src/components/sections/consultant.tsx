import { BadgeCheck, Mail, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import photoAsset from "@/assets/andres-strahovki.jpg.asset.json";

const steps = [
  {
    icon: Send,
    title: "Ви залишаєте заявку на сайті",
    description: "Розраховуєте вартість у калькуляторі й надсилаєте заявку — це займає 2 хвилини.",
  },
  {
    icon: MessageCircle,
    title: "Заявка одразу приходить мені в Telegram",
    description: "Я особисто бачу кожне замовлення й зв'язуюсь із вами для підтвердження даних.",
  },
  {
    icon: ShieldCheck,
    title: "Я оформлюю поліс онлайн",
    description: "Працюю напряму зі страховими EUROINS та USG — жодних посередників і накруток.",
  },
  {
    icon: Mail,
    title: "Надсилаю готовий поліс",
    description: "Отримуєте електронний поліс у Telegram або на email — одразу після оформлення.",
  },
];

export function ConsultantSection({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  return (
    <section className="border-y border-border bg-secondary/40 py-20">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="mx-auto w-full max-w-sm">
          <img
            src={photoAsset.url}
            alt="Куршацов Андрій — страховий консультант"
            width={800}
            height={800}
            loading="lazy"
            className="w-full rounded-3xl object-cover shadow-lift"
          />
          <div className="mt-6 text-center lg:text-left">
            <p className="text-xl font-extrabold">Куршацов Андрій</p>
            <p className="text-sm font-medium text-muted-foreground">
              Страховий консультант · працюю з клієнтами особисто
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
              <Button asChild size="sm">
                <a href={site.telegramUrl} target="_blank" rel="noreferrer">
                  <Send className="size-4" /> Telegram
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={`tel:${site.phonePrimary.replace(/[^+\d]/g, "")}`}>
                  <Phone className="size-4" /> Подзвонити
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Особистий підхід
          </span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Вашу страховку оформлюю я особисто
          </h2>
          <p className="mt-4 text-muted-foreground">
            Мене звати Андрій Куршацов, я страховий консультант. За кожною заявкою з сайту стоїть
            жива людина: я перевіряю дані, підбираю оптимальний тариф і оформлюю офіційний поліс
            онлайн. Ви завжди спілкуєтесь напряму зі мною, без кол-центрів.
          </p>

          {variant === "full" ? (
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Крок {index + 1}
                    </span>
                  </div>
                  <p className="mt-3 font-bold">{step.title}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="mt-6 grid gap-3">
              {steps.map((step) => (
                <li key={step.title} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-sm">
                    <span className="font-semibold">{step.title}.</span>{" "}
                    <span className="text-muted-foreground">{step.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
