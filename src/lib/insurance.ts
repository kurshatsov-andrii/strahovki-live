export const PRODUCTS = ["auto", "green_card", "travel", "sport"] as const;
export type ProductKey = (typeof PRODUCTS)[number];

export const productLabels: Record<ProductKey, string> = {
  auto: "Автоцивілка",
  green_card: "Зелена карта",
  travel: "Туристичне страхування",
  sport: "Спортивне страхування",
};

export type CalcField = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

export type ProductConfig = {
  title: string;
  fields: CalcField[];
  /** true → ціна рахується за день і множиться на кількість днів */
  usesDays: boolean;
};

export const productConfigs: Record<ProductKey, ProductConfig> = {
  auto: {
    title: "Калькулятор автоцивілки",
    usesDays: false,
    fields: [
      {
        key: "region",
        label: "Регіон реєстрації",
        options: [
          { value: "kyiv", label: "Київ" },
          { value: "kharkiv", label: "Харків" },
          { value: "lviv", label: "Львів" },
          { value: "odesa", label: "Одеса" },
          { value: "dnipro", label: "Дніпро" },
          { value: "other", label: "Інші міста та області" },
        ],
      },
      {
        key: "vehicle",
        label: "Тип транспортного засобу",
        options: [
          { value: "car_small", label: "Легковий до 1600 см³" },
          { value: "car_medium", label: "Легковий 1601–2000 см³" },
          { value: "car_large", label: "Легковий понад 2000 см³" },
          { value: "truck", label: "Вантажний" },
          { value: "bus", label: "Автобус" },
          { value: "moto", label: "Мотоцикл" },
        ],
      },
      {
        key: "driver",
        label: "Водії",
        options: [
          { value: "experienced", label: "Стаж понад 3 роки" },
          { value: "young", label: "Стаж до 3 років / вік до 25" },
          { value: "unlimited", label: "Без обмеження водіїв" },
        ],
      },
      {
        key: "term",
        label: "Строк дії",
        options: [
          { value: "1", label: "1 місяць" },
          { value: "6", label: "6 місяців" },
          { value: "12", label: "12 місяців" },
        ],
      },
    ],
  },
  green_card: {
    title: "Калькулятор зеленої карти",
    usesDays: false,
    fields: [
      {
        key: "zone",
        label: "Зона покриття",
        options: [
          { value: "europe", label: "Європа (всі країни системи)" },
          { value: "moldova", label: "Молдова" },
        ],
      },
      {
        key: "term",
        label: "Строк дії",
        options: [
          { value: "15", label: "15 днів" },
          { value: "21", label: "21 день" },
          { value: "30", label: "1 місяць" },
          { value: "60", label: "2 місяці" },
          { value: "90", label: "3 місяці" },
          { value: "120", label: "4 місяці" },
          { value: "150", label: "5 місяців" },
          { value: "180", label: "6 місяців" },
          { value: "365", label: "1 рік" },
        ],
      },
    ],
  },

  travel: {
    title: "Калькулятор туристичної страховки",
    usesDays: true,
    fields: [
      {
        key: "zone",
        label: "Напрямок",
        options: [
          { value: "schengen", label: "Шенген / Європа" },
          { value: "turkey_egypt", label: "Туреччина, Єгипет" },
          { value: "world", label: "Весь світ" },
        ],
      },
      {
        key: "coverage",
        label: "Сума покриття",
        options: [
          { value: "30000", label: "30 000 €" },
          { value: "50000", label: "50 000 €" },
          { value: "100000", label: "100 000 €" },
        ],
      },
      {
        key: "age",
        label: "Вік застрахованого",
        options: [
          { value: "under_18", label: "До 18 років" },
          { value: "18_64", label: "18–64 роки" },
          { value: "over_65", label: "65+ років" },
        ],
      },
      {
        key: "activity",
        label: "Активність під час поїздки",
        options: [
          { value: "standard", label: "Звичайний відпочинок" },
          { value: "active", label: "Активний відпочинок" },
          { value: "extreme", label: "Екстремальні види спорту" },
        ],
      },
    ],
  },
  sport: {
    title: "Калькулятор спортивної страховки",
    usesDays: false,
    fields: [
      {
        key: "risk",
        label: "Рівень занять",
        options: [
          { value: "amateur", label: "Аматорський спорт" },
          { value: "pro", label: "Професійний спорт" },
          { value: "extreme", label: "Екстремальні види" },
        ],
      },
      {
        key: "coverage",
        label: "Сума покриття",
        options: [
          { value: "50000", label: "50 000 грн" },
          { value: "100000", label: "100 000 грн" },
          { value: "200000", label: "200 000 грн" },
        ],
      },
      {
        key: "insured",
        label: "Кого страхуємо",
        options: [
          { value: "individual", label: "Одну особу" },
          { value: "team", label: "Команду (до 15 осіб)" },
        ],
      },
      {
        key: "term",
        label: "Строк дії",
        options: [
          { value: "1", label: "1 місяць" },
          { value: "3", label: "3 місяці" },
          { value: "6", label: "6 місяців" },
          { value: "12", label: "12 місяців" },
        ],
      },
    ],
  },
};

export function defaultParams(product: ProductKey): Record<string, string> {
  const params: Record<string, string> = {};
  for (const field of productConfigs[product].fields) {
    params[field.key] = field.options[0]!.value;
  }
  if (productConfigs[product].usesDays) params["days"] = "10";
  return params;
}

export function describeParams(product: ProductKey, params: Record<string, unknown>): string[] {
  const config = productConfigs[product];
  if (!config) return [];
  const parts = config.fields.map((field) => {
    const raw = String(params[field.key] ?? "");
    const option = field.options.find((o) => o.value === raw);
    return `${field.label}: ${option?.label ?? (raw || "—")}`;
  });
  if (config.usesDays) parts.push(`Кількість днів: ${String(params["days"] ?? "—")}`);
  return parts;
}

export type Coefficients = Record<string, Record<string, number>>;

export function computePrice(
  basePrice: number,
  coefficients: Coefficients,
  perDay: boolean,
  params: Record<string, string>,
  days: number,
): number {
  let price = basePrice;
  for (const [group, values] of Object.entries(coefficients ?? {})) {
    const selected = params[group];
    if (!selected) continue;
    const factor = values?.[selected];
    if (typeof factor === "number" && Number.isFinite(factor)) price *= factor;
  }
  if (perDay) price *= Math.max(1, days);
  return Math.round(price);
}

export const leadStatuses = [
  { value: "new", label: "Нова" },
  { value: "in_progress", label: "В роботі" },
  { value: "issued", label: "Оформлена" },
  { value: "rejected", label: "Відмова" },
] as const;

export type LeadStatus = (typeof leadStatuses)[number]["value"];

export function statusLabel(status: string): string {
  return leadStatuses.find((s) => s.value === status)?.label ?? status;
}

export function formatUah(value: number): string {
  return `${new Intl.NumberFormat("uk-UA").format(value)} грн`;
}
