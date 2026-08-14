import { ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Variant = "all" | "auto" | "green_card";

const links = {
  auto: {
    href: "https://policy.mtsbu.ua/#tab1",
    label: "Перевірити автоцивілку",
  },
  green_card: {
    href: "https://policy.mtsbu.ua/#tab2",
    label: "Перевірити зелену карту",
  },
} as const;

export function PolicyCheckSection({ variant = "all" }: { variant?: Variant }) {
  const items =
    variant === "all" ? [links.auto, links.green_card] : [links[variant]];

  return (
    <section className="py-12">
      <div className="container-page">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
          <ShieldCheck className="size-8 text-primary" />
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Перевірка чинності полісу
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Офіційний сервіс МТСБУ — перевірте статус вашого полісу онлайн.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {items.map((item) => (
              <Button key={item.href} asChild variant="outline">
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
