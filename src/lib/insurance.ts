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
  /** фіксовані умови поліса, які показуємо в калькуляторі */
  notes?: string[];
};

const sportGroups: { group: string; label: string; sports: string[] }[] = [
  {
    group: "g1",
    label: "1С",
    sports: [
      "Нарди",
      "Шашки",
      "Шахи",
      "Спортивний бридж",
      "Авіамодельний спорт",
      "Автомодельний спорт",
      "Ракетомодельний спорт",
      "Судномодельний спорт",
      "Більярдний спорт",
      "Рибальський спорт",
      "Радіоспорт",
      "Дартс",
    ],
  },
  {
    group: "g2",
    label: "2С",
    sports: [
      "Теніс настільний",
      "Городковий спорт",
      "Гольф, міні-гольф",
      "Бадмінтон",
      "Буєрний спорт",
      "Вітрильний спорт",
      "Боулінг",
      "Волейбол",
      "Петанк",
      "Перетягування каната",
      "Плавання (крім підводного), синхронне плавання",
      "Пішохідний туризм",
      "Повітроплавний спорт",
      "Роликовий спорт",
      "Сквош",
      "Спортивна аеробіка",
      "Спорт з собаками",
      "Спортивне орієнтування",
      "Спортивні танці",
      "Пляжний волейбол",
      "Художня гімнастика",
      "Естетична гімнастика",
      "Лижні гонки (крім гірськолижного спорту)",
      "Танцювальний спорт",
      "Тренування в тренажерних залах",
      "Фітнес",
      "Чирлідинг",
      "Шейпінг",
      "Акробатичний рок-н-рол",
    ],
  },
  {
    group: "g3",
    label: "3С",
    sports: [
      "Легка атлетика",
      "Велосипедний спорт",
      "Триатлон",
      "Армрестлінг",
      "Американський футбол",
      "Бейсбол",
      "Біатлон",
      "Бодібілдинг",
      "Самбо, бойове самбо",
      "Боротьба на поясах, Алиш, вільна, греко-римська, Кураш",
      "Вертолітний спорт",
      "Веслування слалом, академічна, на байдарках і каное, на човнах «Дракон»",
      "Віндсерфінг",
      "Воднолижний спорт",
      "Водне поло",
      "Пляжний гандбол, пляжний футбол",
      "Пожежно-прикладний спорт",
      "Практична стрільба",
      "Рафтинг (спортивний туризм)",
      "Рукопашний бій",
      "Софтбол",
      "Спелеотуризм (спортивний туризм)",
      "Спортивна акробатика",
      "Спортивний туризм",
      "Спортинг",
      "Стрибки на батуті",
      "Стрільба з лука, кульова, стендова",
      "Стрибки у воду",
      "Сумо",
      "Тхеквондо",
      "Джиу-джитсу",
      "Дзюдо",
      "Кікбоксинг",
      "Гандбол",
      "Гирьовий спорт",
      "Годзю-рю карате",
      "Кайтінг (спортивний туризм)",
      "Змішані єдиноборства",
      "Карате",
      "Кунгфу",
      "Лижне двоборство",
      "Теніс",
      "Трекінг (спортивний туризм)",
      "Українська боротьба на поясах",
      "Український рукопаш «Спас»",
      "Ушу",
      "Універсальний бій",
      "Фехтування",
      "Фігурне катання на ковзанах",
      "Французький бокс Сават",
      "Фрі-файт (бій без правил)",
      "Футбол",
      "Футзал",
      "Хортинг",
      "Пейнтбол",
    ],
  },
  {
    group: "g4",
    label: "4С",
    sports: [
      "Баскетбол",
      "Автомобільний спорт",
      "Аквабайк",
      "Багатоборство охоронців",
      "Бобслей",
      "Богатирське багатоборство",
      "Важка атлетика",
      "Бокс",
      "Вейкбординг",
      "Військово-спортивне багатоборство",
      "Водно-моторний спорт",
      "Підводний спорт",
      "Поліатлон",
      "Планерний спорт",
      "Регбі, регбіліг",
      "Ралі",
      "Санний спорт (бобслей)",
      "Альпінізм, скелелазіння",
      "Сноубординг",
      "Спідвей",
      "Стрибки на лижах з трампліна",
      "Стронгмен",
      "Сучасне п’ятиборство",
      "Спортивна гімнастика",
      "Гірськолижний спорт",
      "Дельтапланерний спорт",
      "Картинг",
      "Кінний спорт",
      "Ковзанярський спорт",
      "Літаковий спорт",
      "Морське багатоборство",
      "Мотобол",
      "Мотоспорт",
      "Панкратіон",
      "Парапланерний спорт",
      "Пауерліфтинг",
      "Флорбол (хокей у залі)",
      "Фристайл",
      "Хокей із шайбою",
      "Хокей на траві",
      "Шорт-трек",
      "Парашутний спорт",
    ],
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-zа-яїієґ0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export const sportOptions = sportGroups.flatMap((g) =>
  g.sports.map((sport) => ({
    value: `${g.group}:${slugify(sport)}`,
    label: `${g.label} · ${sport}`,
  })),
);


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
    notes: [
      "Страхова сума: 35 000 грн",
      "Строк дії: 1 рік",
      "Аматорський спорт",
    ],
    fields: [
      {
        key: "sport",
        label: "Вид спорту (група ризику)",
        options: sportOptions,
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

export const extraParamLabels: Record<string, string> = {
  last_name: "Прізвище",
  first_name: "Ім'я",
  middle_name: "По батькові",
  birth_date: "Дата народження",
  tax_id: "Ідентифікаційний код",
  passport_number: "Номер паспорта",
  passport_issuer: "Ким виданий паспорт",
  passport_date: "Коли виданий паспорт",
  address: "Адреса проживання",
  viber_phone: "Viber для оплати",
};

/** Усі параметри заявки: продуктові поля + персональні дані клієнта. */
export function describeAllParams(
  product: ProductKey | null,
  params: Record<string, unknown>,
): string[] {
  const config = product ? productConfigs[product] : undefined;
  const known = new Set<string>([
    ...(config?.fields.map((f) => f.key) ?? []),
    ...(config?.usesDays ? ["days"] : []),
  ]);
  const base = product ? describeParams(product, params) : [];
  const rest = Object.entries(params ?? {})
    .filter(([key, value]) => !known.has(key) && value !== null && String(value).trim() !== "")
    .map(([key, value]) => `${extraParamLabels[key] ?? key}: ${String(value)}`);
  return [...base, ...rest];
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
  const effective: Record<string, string> = { ...params };
  if (params["zone"] && params["term"]) {
    effective["zone_term"] = `${params["zone"]}_${params["term"]}`;
  }
  if (params["sport"]) {
    effective["sport_group"] = params["sport"].split(":")[0] ?? "";
  }

  for (const [group, values] of Object.entries(coefficients ?? {})) {
    const selected = effective[group];
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
