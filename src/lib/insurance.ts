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
      "Авіамодельний спорт",
      "Автомодельний спорт",
      "Більярдний спорт",
      "Дартс",
      "Нарди",
      "Радіоспорт",
      "Ракетомодельний спорт",
      "Рибальський спорт",
      "Спортивний бридж",
      "Судномодельний спорт",
      "Шахи",
      "Шашки",
    ],
  },
  {
    group: "g2",
    label: "2С",
    sports: [
      "Акробатичний рок-н-рол",
      "Бадмінтон",
      "Боулінг",
      "Буєрний спорт",
      "Вітрильний спорт",
      "Волейбол",
      "Гольф, міні-гольф",
      "Городковий спорт",
      "Естетична гімнастика",
      "Лижні гонки (крім гірськолижного спорту)",
      "Перетягування каната",
      "Петанк",
      "Пішохідний туризм",
      "Плавання (крім підводного), синхронне плавання",
      "Пляжний волейбол",
      "Повітроплавний спорт",
      "Роликовий спорт",
      "Сквош",
      "Спорт з собаками",
      "Спортивна аеробіка",
      "Спортивне орієнтування",
      "Спортивні танці",
      "Танцювальний спорт",
      "Теніс настільний",
      "Тренування в тренажерних залах",
      "Фітнес",
      "Художня гімнастика",
      "Чирлідинг",
      "Шейпінг",
    ],
  },
  {
    group: "g3",
    label: "3С",
    sports: [
      "Американський футбол",
      "Армрестлінг",
      "Бейсбол",
      "Біатлон",
      "Бодібілдинг",
      "Боротьба на поясах, Алиш, вільна, греко-римська, Кураш",
      "Велосипедний спорт",
      "Вертолітний спорт",
      "Веслування слалом, академічна, на байдарках і каное, на човнах «Дракон»",
      "Віндсерфінг",
      "Водне поло",
      "Воднолижний спорт",
      "Гандбол",
      "Гирьовий спорт",
      "Годзю-рю карате",
      "Джиу-джитсу",
      "Дзюдо",
      "Змішані єдиноборства",
      "Кайтінг (спортивний туризм)",
      "Карате",
      "Кікбоксинг",
      "Кунгфу",
      "Легка атлетика",
      "Лижне двоборство",
      "Пейнтбол",
      "Пляжний гандбол, пляжний футбол",
      "Пожежно-прикладний спорт",
      "Практична стрільба",
      "Рафтинг (спортивний туризм)",
      "Рукопашний бій",
      "Самбо, бойове самбо",
      "Софтбол",
      "Спелеотуризм (спортивний туризм)",
      "Спортивна акробатика",
      "Спортивний туризм",
      "Спортинг",
      "Стрибки на батуті",
      "Стрибки у воду",
      "Стрільба з лука, кульова, стендова",
      "Сумо",
      "Теніс",
      "Трекінг (спортивний туризм)",
      "Триатлон",
      "Тхеквондо",
      "Українська боротьба на поясах",
      "Український рукопаш «Спас»",
      "Універсальний бій",
      "Ушу",
      "Фехтування",
      "Фігурне катання на ковзанах",
      "Французький бокс Сават",
      "Фрі-файт (бій без правил)",
      "Футбол",
      "Футзал",
      "Хортинг",
    ],
  },
  {
    group: "g4",
    label: "4С",
    sports: [
      "Автомобільний спорт",
      "Аквабайк",
      "Альпінізм, скелелазіння",
      "Багатоборство охоронців",
      "Баскетбол",
      "Бобслей",
      "Богатирське багатоборство",
      "Бокс",
      "Важка атлетика",
      "Вейкбординг",
      "Військово-спортивне багатоборство",
      "Водно-моторний спорт",
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
      "Парашутний спорт",
      "Пауерліфтинг",
      "Підводний спорт",
      "Планерний спорт",
      "Поліатлон",
      "Ралі",
      "Регбі, регбіліг",
      "Санний спорт (бобслей)",
      "Сноубординг",
      "Спідвей",
      "Спортивна гімнастика",
      "Стрибки на лижах з трампліна",
      "Стронгмен",
      "Сучасне п’ятиборство",
      "Флорбол (хокей у залі)",
      "Фристайл",
      "Хокей із шайбою",
      "Хокей на траві",
      "Шорт-трек",
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

export const sportOptions = sportGroups
  .flatMap((g) =>
    g.sports.map((sport) => ({
      value: `${g.group}:${slugify(sport)}`,
      label: sport,
    })),
  )
  .sort((a, b) => a.label.localeCompare(b.label, "uk"));



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
    usesTravelDates: true,
    notes: [
      "Мінімальний строк — 7 днів, максимальний — 90 днів",
      "Оформлення для осіб віком до 70 років",
    ],
    fields: [
      {
        key: "zone",
        label: "Територія дії договору",
        options: [
          { value: "schengen", label: "Європа" },
          { value: "world", label: "Весь світ" },
        ],
      },
      {
        key: "country",
        label: "Країна поїздки",
        options: travelCountryOptions,
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
        key: "activity",
        label: "Активність під час поїздки",
        options: [
          { value: "standard", label: "Звичайний відпочинок" },
          { value: "active", label: "Активний відпочинок" },
        ],
      },
      {
        key: "franchise",
        label: "Франшиза",
        options: [
          { value: "0", label: "0 €" },
          { value: "50", label: "50 €" },
          { value: "100", label: "100 €" },
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
        label: "Вид спорту",
        options: sportOptions,
      },
      {
        key: "age",
        label: "Вік застрахованого",
        options: [
          { value: "a1", label: "З 6 до 15 років" },
          { value: "a2", label: "З 16 до 50 років" },
          { value: "a3", label: "З 51 до 65 років" },
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
  start_date: "Початок дії полісу",
  doc_type: "Тип документа",
  doc_series: "Серія документа",
  doc_number: "Номер документа",
  doc_issuer: "Ким виданий документ",
  doc_date: "Дата видачі документа",
  region: "Область",
  city: "Населений пункт",
  street: "Вулиця",
  house: "№ будинку",
  apartment: "№ квартири",
  plate: "Номерний знак",
  vehicle_type: "Тип ТЗ",
  vin: "VIN (номер кузова)",
  car_brand: "Марка авто",
  car_model: "Модель авто",
  car_year: "Рік випуску",
  seats: "К-сть місць",
  mass_total: "Повна маса, кг",
  mass_empty: "Маса без навантаження, кг",
  engine_volume: "Об'єм двигуна, куб. см",
  power_kw: "Потужність, кВт",
};

const dateKeys = new Set(["birth_date", "passport_date", "doc_date", "start_date"]);

const dmyRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDisplayDate(value: string): string | null {
  if (!value) return null;
  const dmy = value.match(dmyRegex);
  if (dmy) return value;
  const iso = value.match(isoDateRegex);
  if (iso) {
    const [, y, m, d] = iso;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (
      date.getFullYear() === Number(y) &&
      date.getMonth() === Number(m) - 1 &&
      date.getDate() === Number(d)
    ) {
      return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
    }
  }
  return null;
}

export function formatDateTime(value: string | Date | number): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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
    .map(([key, value]) => {
      const label = extraParamLabels[key] ?? key;
      const raw = String(value);
      const display =
        dateKeys.has(key) || isoDateRegex.test(raw) ? formatDisplayDate(raw) ?? raw : raw;
      return `${label}: ${display}`;
    });
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
    if (params["age"]) {
      effective["group_age"] = `${effective["sport_group"]}_${params["age"]}`;
    }
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
