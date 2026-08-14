import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowRight, Calculator, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getQuotes, submitLead, type Quote } from "@/lib/quotes.functions";
import {
  defaultParams,
  formatUah,
  productConfigs,
  productLabels,
  type ProductKey,
} from "@/lib/insurance";

const productRoutes: Record<ProductKey, string> = {
  auto: "/autostrahuvannya",
  green_card: "/zelena-karta",
  travel: "/turystychne-strahuvannya",
  sport: "/sportyvne-strahuvannya",
};

type CrossSell = {
  target: ProductKey;
  headline: string;
  body: string;
};

const crossSells: Partial<Record<ProductKey, CrossSell>> = {
  green_card: {
    target: "travel",
    headline: "Їдете за кордон автомобілем?",
    body: "Додайте туристичне страхування для водія та пасажирів.",
  },
  travel: {
    target: "green_card",
    headline: "Подорожуєте власним авто?",
    body: "Перевірте, чи потрібна вам Зелена карта.",
  },
  sport: {
    target: "travel",
    headline: "Біжите за кордоном?",
    body: "Можливо, вам також потрібне туристичне страхування.",
  },
};

export function InsuranceCalculator({ product }: { product: ProductKey }) {
  const config = productConfigs[product];
  const [params, setParams] = useState<Record<string, string>>(() => defaultParams(product));
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selected, setSelected] = useState<Quote | null>(null);

  const calcFn = useServerFn(getQuotes);
  const calculate = useMutation({
    mutationFn: (values: Record<string, string>) =>
      calcFn({ data: { product, params: values } }),
    onSuccess: (data) => setQuotes(data),
    onError: () => toast.error("Не вдалося розрахувати вартість. Спробуйте ще раз."),
  });

  useEffect(() => {
    const next = defaultParams(product);
    setParams(next);
    setQuotes([]);
    calculate.mutate(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const days = useMemo(() => Number(params["days"] ?? 1) || 1, [params]);

  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("uk-UA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
  }, []);

  return (
    <section id="calculator" className="bg-secondary/50 py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Calculator className="size-4" /> Розрахунок онлайн
          </div>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">{config.title}</h2>
          <p className="mt-3 text-muted-foreground">
            Оберіть параметри — покажемо актуальні тарифи страхових компаній.
          </p>
          <p className="mt-2 text-sm font-semibold text-primary">
            Актуальні ціни на {today || "сьогодні"}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
          <form
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              calculate.mutate(params);
            }}
          >
            <div className="grid gap-4">
              {config.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Select
                    value={params[field.key] ?? ""}
                    onValueChange={(value) =>
                      setParams((prev) => ({ ...prev, [field.key]: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {config.usesDays && (
                <div className="space-y-2">
                  <Label htmlFor="days">Кількість днів поїздки</Label>
                  <Input
                    id="days"
                    type="number"
                    min={1}
                    max={365}
                    value={params["days"] ?? "10"}
                    onChange={(event) =>
                      setParams((prev) => ({ ...prev, days: event.target.value }))
                    }
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={calculate.isPending}>
              {calculate.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Розрахувати вартість
            </Button>
          </form>

          <div className="space-y-4">
            {calculate.isPending && quotes.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-soft">
                Рахуємо тарифи…
              </div>
            )}
            {!calculate.isPending && quotes.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-soft">
                Заповніть параметри та натисніть «Розрахувати вартість».
              </div>
            )}
            {quotes.map((quote, index) => (
              <div
                key={quote.tariffId}
                className={`rounded-2xl border bg-card p-6 shadow-soft ${
                  index === 0 ? "border-primary" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="size-4 text-primary" />
                      {quote.company}
                    </div>
                    {index === 0 && (
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        Найвигідніша пропозиція
                      </div>
                    )}
                    {quote.note && (
                      <p className="mt-2 text-sm text-muted-foreground">{quote.note}</p>
                    )}
                    {config.usesDays && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Розрахунок на {days} {days === 1 ? "день" : "днів"}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold">{formatUah(quote.price)}</div>
                    <Button className="mt-3" size="sm" onClick={() => setSelected(quote)}>
                      Оформити
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LeadDialog
        product={product}
        params={params}
        quote={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function LeadDialog({
  product,
  params,
  quote,
  onClose,
}: {
  product: ProductKey;
  params: Record<string, string>;
  quote: Quote | null;
  onClose: () => void;
}) {
  const submitFn = useServerFn(submitLead);
  const mutation = useMutation({
    mutationFn: (values: {
      name: string;
      phone: string;
      email: string;
      message: string;
    }) =>
      submitFn({
        data: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          message: values.message,
          product,
          params,
          company: quote?.company ?? "",
          price: quote?.price ?? 0,
        },
      }),
    onSuccess: () => {
      toast.success("Заявку надіслано", {
        description: "Менеджер зв'яжеться з вами найближчим часом.",
      });
      onClose();
    },
    onError: () => toast.error("Не вдалося надіслати заявку. Перевірте дані."),
  });

  return (
    <Dialog open={quote !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оформлення: {productLabels[product]}</DialogTitle>
          <DialogDescription>
            {quote ? `${quote.company} — ${formatUah(quote.price)}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            mutation.mutate({
              name: String(form.get("name") ?? ""),
              phone: String(form.get("phone") ?? ""),
              email: String(form.get("email") ?? ""),
              message: String(form.get("message") ?? ""),
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="lead-name">Ім'я</Label>
            <Input id="lead-name" name="name" required maxLength={100} placeholder="Ваше ім'я" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Телефон</Label>
            <Input
              id="lead-phone"
              name="phone"
              required
              type="tel"
              maxLength={30}
              placeholder="+38 (0__) ___-__-__"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email (необов'язково)</Label>
            <Input id="lead-email" name="email" type="email" maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-message">Коментар</Label>
            <Textarea id="lead-message" name="message" rows={3} maxLength={1000} />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Надіслати заявку
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
