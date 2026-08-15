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
import { FieldError } from "@/components/ui/field-error";
import {
  fieldErrors,
  greenCardLeadSchema,
  simpleLeadSchema,
  sportLeadSchema,
} from "@/lib/lead-validation";
import {
  greenCardApplicantFields,
  sportApplicantFields,
  type ApplicantField,
} from "@/lib/applicant-fields";

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
        month: "2-digit",
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
            {config.notes && config.notes.length > 0 && (
              <ul className="mb-4 space-y-1 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                {config.notes.map((note) => (
                  <li key={note} className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    {note}
                  </li>
                ))}
              </ul>
            )}
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

            {quotes.length > 0 && <CrossSellBlock current={product} />}
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

function CrossSellBlock({ current }: { current: ProductKey }) {
  const offer = crossSells[current];
  if (!offer) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold">{offer.headline}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{offer.body}</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to={productRoutes[offer.target]}>
              {productLabels[offer.target]}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
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
  const isSport = product === "sport";
  const isGreenCard = product === "green_card";
  const detailedFields: ApplicantField[] = isSport
    ? sportApplicantFields
    : isGreenCard
      ? greenCardApplicantFields
      : [];
  const isDetailed = detailedFields.length > 0;
  const [docType, setDocType] = useState("Посвідчення водія");
  const visibleFields = detailedFields.filter(
    (field) => !(field.name === "doc_series" && docType.toLowerCase().includes("id")),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateValues, setDateValues] = useState<Record<string, string>>({});
  const submitFn = useServerFn(submitLead);

  useEffect(() => {
    if (quote) setDateValues({});
  }, [quote]);

  function formatDateInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  }

  const mutation = useMutation({
    mutationFn: (values: {
      name: string;
      phone: string;
      email: string;
      message: string;
      extra: Record<string, string>;
    }) =>
      submitFn({
        data: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          message: values.message,
          product,
          params: { ...params, ...values.extra },
          company: quote?.company ?? "",
          price: quote?.price ?? 0,
        },
      }),
    onSuccess: () => {
      setErrors({});
      toast.success("Заявку надіслано", {
        description: isSport
          ? "Посилання на оплату надішлемо у Viber (бізнес-чат EUROINS)."
          : "Менеджер зв'яжеться з вами найближчим часом.",
      });
      onClose();
    },
    onError: () => toast.error("Не вдалося надіслати заявку. Перевірте дані."),
  });

  return (
    <Dialog
      open={quote !== null}
      onOpenChange={(open) => {
        if (!open) {
          setErrors({});
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Оформлення: {productLabels[product]}</DialogTitle>
          <DialogDescription>
            {quote ? `${quote.company} — ${formatUah(quote.price)}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const raw = Object.fromEntries(
              [...form.entries()].map(([key, value]) => [key, String(value)]),
            );

            const parsed = isSport
              ? sportLeadSchema.safeParse(raw)
              : isGreenCard
                ? greenCardLeadSchema.safeParse(raw)
                : simpleLeadSchema.safeParse(raw);

            if (!parsed.success) {
              setErrors(fieldErrors(parsed.error));
              toast.error("Перевірте правильність заповнення полів");
              return;
            }
            setErrors({});
            const values = parsed.data as Record<string, string | undefined>;

            const extra: Record<string, string> = {};
            for (const field of visibleFields) {
              const value = String(raw[field.name] ?? "").trim();
              if (value) extra[field.name] = value;
            }

            mutation.mutate({
              name: isDetailed
                ? `${values["last_name"] ?? ""} ${values["first_name"] ?? ""} ${values["middle_name"] ?? ""}`.trim()
                : String(values["name"] ?? ""),
              phone: String(values["viber_phone"] ?? values["phone"] ?? ""),
              email: String(values["email"] ?? ""),
              message: values["message"] ?? "",
              extra,
            });
          }}
        >
          {isDetailed ? (
            <>
              <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                {isSport
                  ? "Для оформлення полісу заповніть усі поля. Посилання на оплату надійде у Viber — бізнес-чат EUROINS."
                  : "Для оформлення зеленої карти заповніть дані страхувальника, документа та транспортного засобу."}
              </p>
              {isGreenCard && (
                <p className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-semibold text-primary">
                  Увага: всі дані вписуйте ТІЛЬКИ англійськими літерами (латиницею) — так вони
                  друкуються у полісі Зелена карта.
                </p>
              )}
              {visibleFields.map((field) => {
                const isDate = field.kind === "date";
                return (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={`lead-${field.name}`}>{field.label}</Label>
                    {field.kind === "select" ? (
                      <select
                        id={`lead-${field.name}`}
                        name={field.name}
                        defaultValue={field.options?.[0]?.value ?? ""}
                        onChange={
                          field.name === "doc_type"
                            ? (event) => setDocType(event.target.value)
                            : undefined
                        }
                        aria-invalid={Boolean(errors[field.name])}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <Input
                          id={`lead-${field.name}`}
                          name={field.name}
                          maxLength={isDate ? 10 : 200}
                          aria-invalid={Boolean(errors[field.name])}
                          type={field.kind === "tel" ? "tel" : "text"}
                          list={field.kind === "combo" ? `list-${field.name}` : undefined}
                          placeholder={field.placeholder}
                          value={isDate ? (dateValues[field.name] ?? "") : undefined}
                          onChange={
                            isDate
                              ? (event) =>
                                  setDateValues((prev) => ({
                                    ...prev,
                                    [field.name]: formatDateInput(event.target.value),
                                  }))
                              : undefined
                          }
                        />
                        {field.kind === "combo" && (
                          <datalist id={`list-${field.name}`}>
                            {field.suggestions?.map((item) => (
                              <option key={item} value={item} />
                            ))}
                          </datalist>
                        )}
                      </>
                    )}
                    {field.hint && (
                      <p className="text-xs text-muted-foreground">{field.hint}</p>
                    )}
                    <FieldError message={errors[field.name]} />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="lead-name">Ім'я</Label>
                <Input
                  id="lead-name"
                  name="name"
                  maxLength={100}
                  aria-invalid={Boolean(errors["name"])}
                  placeholder="Ваше ім'я"
                />
                <FieldError message={errors["name"]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-phone">Телефон</Label>
                <Input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  maxLength={30}
                  aria-invalid={Boolean(errors["phone"])}
                  placeholder="+38 (0__) ___-__-__"
                />
                <FieldError message={errors["phone"]} />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              name="email"
              type="email"
              maxLength={255}
              aria-invalid={Boolean(errors["email"])}
              placeholder="you@example.com"
            />
            <FieldError message={errors["email"]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-message">Коментар</Label>
            <Textarea
              id="lead-message"
              name="message"
              rows={3}
              maxLength={1000}
              aria-invalid={Boolean(errors["message"])}
            />
            <FieldError message={errors["message"]} />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isDetailed ? "Оформити поліс" : "Надіслати заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
