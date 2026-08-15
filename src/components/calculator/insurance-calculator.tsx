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
  ageFromBirthDate,
  autoDriverBand,
  autoTermOptionsForeign,
  autoTermOptionsUa,
  AUTO_MAX_DRIVER_AGE,
  AUTO_MIN_DRIVER_AGE,
  defaultParams,
  formatUah,
  isEuropeanTravelCountry,
  productConfigs,
  productLabels,
  travelAgeBand,
  travelDays,
  TRAVEL_MAX_AGE,
  TRAVEL_MAX_DAYS,
  TRAVEL_MIN_DAYS,
  type ProductKey,
} from "@/lib/insurance";
import { citiesForRegion, defaultCityForRegion, ukraineRegionOptions } from "@/lib/ukraine-regions";
import { FieldError } from "@/components/ui/field-error";
import { DateField } from "@/components/ui/date-field";
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
  const isTravel = Boolean(config.usesTravelDates);
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

  const travelAge = useMemo(
    () => (isTravel ? ageFromBirthDate(params["birth_date"] ?? "") : null),
    [isTravel, params],
  );
  const tooOld = travelAge !== null && travelAge > TRAVEL_MAX_AGE;

  const computedDays = useMemo(
    () => (isTravel ? travelDays(params["date_from"] ?? "", params["date_to"] ?? "") : null),
    [isTravel, params],
  );

  const returnBounds = useMemo(() => {
    if (!isTravel) return null;
    const raw = params["date_from"] ?? "";
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(raw)) return null;
    const parts = raw.split(".").map(Number);
    const start = new Date(parts[2]!, parts[1]! - 1, parts[0]!);
    if (Number.isNaN(start.getTime())) return null;
    const min = new Date(start);
    min.setDate(min.getDate() + TRAVEL_MIN_DAYS - 1);
    const max = new Date(start);
    max.setDate(max.getDate() + TRAVEL_MAX_DAYS - 1);
    return { min, max };
  }, [isTravel, params]);

  const travelError = useMemo(() => {
    if (!isTravel) return null;
    if (!params["birth_date"]) return "Вкажіть дату народження застрахованого.";
    if (travelAge === null) return "Некоректна дата народження. Формат: дд.мм.рррр";
    if (computedDays === null) return "Вкажіть коректні дати виїзду та приїзду.";
    if (computedDays < TRAVEL_MIN_DAYS) return `Мінімальний строк — ${TRAVEL_MIN_DAYS} днів.`;
    if (computedDays > TRAVEL_MAX_DAYS) return `Максимальний строк — ${TRAVEL_MAX_DAYS} днів.`;
    return null;
  }, [isTravel, params, travelAge, computedDays]);

  useEffect(() => {
    if (!isTravel) return;
    const value = computedDays ? String(computedDays) : "";
    setParams((prev) => (prev["days"] === value ? prev : { ...prev, days: value }));
  }, [isTravel, computedDays]);

  useEffect(() => {
    if (!isTravel) return;
    const country = params["country"] ?? "";
    if (!isEuropeanTravelCountry(country) && params["zone"] !== "world") {
      setParams((prev) => ({ ...prev, zone: "world" }));
    }
  }, [isTravel, params["country"], params["zone"]]);

  const isAuto = Boolean(config.usesAutoForm);
  const autoTermOptions = useMemo(
    () => (params["plates"] === "foreign" ? autoTermOptionsForeign : autoTermOptionsUa),
    [params["plates"]],
  );
  const autoCityOptions = useMemo(
    () => (isAuto ? citiesForRegion(params["region"] ?? "") : []),
    [isAuto, params["region"]],
  );
  const autoAge = useMemo(() => Number(params["driver_age"] ?? ""), [params["driver_age"]]);
  const autoAgeError = useMemo(() => {
    if (!isAuto) return null;
    if (!params["driver_age"]) return "Вкажіть вік наймолодшого водія.";
    if (!Number.isFinite(autoAge) || autoAge < AUTO_MIN_DRIVER_AGE || autoAge > AUTO_MAX_DRIVER_AGE)
      return `Вік має бути від ${AUTO_MIN_DRIVER_AGE} до ${AUTO_MAX_DRIVER_AGE} років.`;
    return null;
  }, [isAuto, params["driver_age"], autoAge]);

  useEffect(() => {
    if (!isAuto) return;
    if (!autoTermOptions.some((o) => o.value === params["term"])) {
      setParams((prev) => ({ ...prev, term: autoTermOptions.at(-1)!.value }));
    }
  }, [isAuto, autoTermOptions, params["term"]]);

  const runCalculation = (values: Record<string, string>) => {
    if (isTravel) {
      const age = ageFromBirthDate(values["birth_date"] ?? "");
      if (age === null || age > TRAVEL_MAX_AGE) return;
      const d = travelDays(values["date_from"] ?? "", values["date_to"] ?? "");
      if (!d || d < TRAVEL_MIN_DAYS || d > TRAVEL_MAX_DAYS) return;
      const enriched = { coverage: "30000", franchise: "0", ...values };
      calculate.mutate({ ...enriched, days: String(d), age: travelAgeBand(age) });
      return;
    }
    if (isAuto) {
      const age = Number(values["driver_age"] ?? "");
      if (!Number.isFinite(age) || age < AUTO_MIN_DRIVER_AGE || age > AUTO_MAX_DRIVER_AGE) return;
      const cleaned: Record<string, string> = { ...values, driver: autoDriverBand(age) };
      if (values["plates"] !== "ua") {
        delete cleaned["region"];
        delete cleaned["city"];
      }
      calculate.mutate(cleaned);
      return;
    }
    calculate.mutate(values);
  };

  useEffect(() => {
    const next = defaultParams(product);
    setParams(next);
    setQuotes([]);
    if (!productConfigs[product].usesTravelDates) calculate.mutate(next);
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
              runCalculation(params);
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

              {isAuto && (
                <div className="space-y-2">
                  <Label htmlFor="driver_age">Вік наймолодшого водія, який буде за кермом</Label>
                  <Input
                    id="driver_age"
                    type="number"
                    min={AUTO_MIN_DRIVER_AGE}
                    max={AUTO_MAX_DRIVER_AGE}
                    value={params["driver_age"] ?? ""}
                    onChange={(event) =>
                      setParams((prev) => ({ ...prev, driver_age: event.target.value }))
                    }
                  />
                  {autoAgeError && <p className="text-xs text-destructive">{autoAgeError}</p>}
                </div>
              )}

              {config.fields.map((field) => {
                const isZone = isTravel && field.key === "zone";
                const country = params["country"] ?? "";
                const zoneLocked = isZone && !isEuropeanTravelCountry(country);
                const options = zoneLocked
                  ? [{ value: "world", label: "Весь світ" }]
                  : isAuto && field.key === "term"
                    ? autoTermOptions
                    : field.options;
                return (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Select
                      value={params[field.key] ?? ""}
                      disabled={zoneLocked}
                      onValueChange={(value) =>
                        setParams((prev) => ({ ...prev, [field.key]: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}

              {isAuto && params["plates"] === "ua" && (
                <>
                  <div className="space-y-2">
                    <Label>Область реєстрації власника ТЗ</Label>
                    <Select
                      value={params["region"] ?? ""}
                      onValueChange={(value) =>
                        setParams((prev) => ({
                          ...prev,
                          region: value,
                          city: defaultCityForRegion(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть область" />
                      </SelectTrigger>
                      <SelectContent>
                        {ukraineRegionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Населений пункт реєстрації власника ТЗ</Label>
                    <Select
                      value={params["city"] ?? ""}
                      onValueChange={(value) => setParams((prev) => ({ ...prev, city: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть населений пункт" />
                      </SelectTrigger>
                      <SelectContent>
                        {autoCityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Пільгова категорія страхувальника — громадянина України</Label>
                    <Select
                      value={params["privilege"] ?? "none"}
                      onValueChange={(value) =>
                        setParams((prev) => ({ ...prev, privilege: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Відсутня" />
                      </SelectTrigger>
                      <SelectContent>
                        {autoPrivilegeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}



              {isTravel && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Дата народження застрахованого</Label>
                    <DateField
                      id="birth_date"
                      name="birth_date"
                      mode="past"
                      value={params["birth_date"] ?? ""}
                      onChange={(value) =>
                        setParams((prev) => ({ ...prev, birth_date: value }))
                      }
                      invalid={tooOld}
                    />
                    {travelAge !== null && !tooOld && (
                      <p className="text-xs text-muted-foreground">Вік: {travelAge} р.</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date_from">Дата виїзду</Label>
                      <DateField
                        id="date_from"
                        name="date_from"
                        mode="future3m"
                        value={params["date_from"] ?? ""}
                        onChange={(value) =>
                          setParams((prev) => ({ ...prev, date_from: value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_to">Дата приїзду</Label>
                      <DateField
                        id="date_to"
                        name="date_to"
                        mode="any"
                        {...(returnBounds ? { minDate: returnBounds.min, maxDate: returnBounds.max } : {})}
                        value={params["date_to"] ?? ""}
                        onChange={(value) => setParams((prev) => ({ ...prev, date_to: value }))}
                        invalid={Boolean(
                          params["date_to"] &&
                            computedDays !== null &&
                            (computedDays < TRAVEL_MIN_DAYS || computedDays > TRAVEL_MAX_DAYS),
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-secondary/60 px-4 py-3 text-sm">
                    Кількість днів поїздки:{" "}
                    <span className="font-semibold">{computedDays ?? "—"}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      (від {TRAVEL_MIN_DAYS} до {TRAVEL_MAX_DAYS} днів)
                    </span>
                  </div>
                </>
              )}

              {config.usesDays && !isTravel && (
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

            {isTravel && tooOld && (
              <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                <p className="font-semibold">Оформлення онлайн доступне до 70 років</p>
                <p className="mt-1 text-muted-foreground">
                  Для мандрівників старше 70 років вартість визначається індивідуально андерайтером, франшиза 50 €, максимальний термін — 14 днів. Напишіть особисто — підберемо умови вручну.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href="https://t.me/Andres_K" target="_blank" rel="noreferrer">
                      Написати в Telegram
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href="viber://chat?number=%2B380664688151">Написати у Viber</a>
                  </Button>
                </div>
              </div>
            )}

            {isTravel && travelError && !tooOld && (
              <p className="mt-4 text-sm text-destructive">{travelError}</p>
            )}

            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={calculate.isPending || (isTravel && (tooOld || Boolean(travelError)))}
            >
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
                    ) : isDate ? (
                      <DateField
                        id={`lead-${field.name}`}
                        name={field.name}
                        mode={field.dateMode ?? "any"}
                        invalid={Boolean(errors[field.name])}
                        placeholder={field.placeholder ?? "дд.мм.рррр"}
                        value={dateValues[field.name] ?? ""}
                        onChange={(value: string) =>
                          setDateValues((prev) => ({ ...prev, [field.name]: value }))
                        }
                      />
                    ) : (
                      <>
                        <Input
                          id={`lead-${field.name}`}
                          name={field.name}
                          maxLength={200}
                          aria-invalid={Boolean(errors[field.name])}
                          type={field.kind === "tel" ? "tel" : "text"}
                          list={field.kind === "combo" ? `list-${field.name}` : undefined}
                          placeholder={field.placeholder}
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
