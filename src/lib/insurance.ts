import { defaultCityForRegion, ukraineRegionOptions, ukraineRegions } from "@/lib/ukraine-regions";
import { autoPrivilegeOptions } from "@/lib/auto-tariffs";

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
  /** true → дні рахуються автоматично з дат виїзду/приїзду + дата народження */
  usesTravelDates?: boolean;
  /** true → форма автоцивілки: вік водія, тип ТЗ, номери, область/місто */
  usesAutoForm?: boolean;
  /** фіксовані умови поліса, які показуємо в калькуляторі */
  notes?: string[];
};

const travelCountries = [
  "Австралія",
  "Австрія",
  "Азербайджан",
  "Аландські острови",
  "Албанія",
  "Алжир",
  "Американські Віргінські острови",
  "Ангілія",
  "Ангола",
  "Андорра",
  "Антигуа і Барбуда",
  "Аргентина",
  "Аруба",
  "Багамські острови",
  "Бангладеш",
  "Барбадос",
  "Бахрейн",
  "Беліз",
  "Бельгія",
  "Бермудські Острови",
  "Болгарія",
  "Болівія",
  "Боснія і Герцеговина",
  "Ботсвана",
  "Бразилія",
  "Британські Віргінські Острови",
  "Бруней Даруссалам",
  "Буркіна-Фасо",
  "Бурунді",
  "Бутан",
  "В'єтнам",
  "Вануату",
  "Ватикан",
  "Ведмежі острови",
  "Великобританія",
  "Венесуела",
  "Вірменія",
  "Габон",
  "Гавайські острови",
  "Гаїті",
  "Гайана",
  "Гамбія",
  "Гана",
  "Гваделупа",
  "Гватемала",
  "Гондурас",
  "Гонконг",
  "Гренада",
  "Гренадіни Сент-Вінсент",
  "Гренландія",
  "Греція",
  "Грузія",
  "Гуам",
  "Данія",
  "Домініка (Співдружність)",
  "Домініканська Республіка",
  "Еквадор",
  "Екваторіальна Гвінея",
  "Естонія",
  "Ефіопія",
  "Єгипет",
  "Замбія",
  "Західна Сахара",
  "Ізраїль",
  "Індія",
  "Індонезія",
  "Іран",
  "Ірландія",
  "Ісландія",
  "Іспанія",
  "Італія",
  "Йорданія",
  "Кабо-Верде",
  "Казахстан",
  "Кайманові Острови",
  "Камбоджа",
  "Камерун",
  "Канада",
  "Канарські острови",
  "Катар",
  "Кенія",
  "Киргизія",
  "Китай",
  "Кіпр",
  "Кірибаті",
  "Колумбія",
  "Коморські Острови",
  "Конго, Демократична Республіка",
  "Конго, Народна Республіка",
  "Корея, Республіка",
  "Коста-Ріка",
  "Кріт",
  "Куба",
  "Курильські острови",
  "Кюрасао",
  "Латвія",
  "Литва",
  "Ліхтенштейн",
  "Люксембург",
  "Маврикій",
  "Мадагаскар",
  "Майорка",
  "Майотта",
  "Македонія",
  "Малайзія",
  "Малі",
  "Мальдиви",
  "Мальта",
  "Марокко",
  "Мартініка",
  "Мексика",
  "Мозамбік",
  "Молдова",
  "Монако",
  "Монголія",
  "Монтсеррат",
  "М'янма",
  "Намібія",
  "Непал",
  "Нігер",
  "Нігерія",
  "Нідерланди",
  "Нікарагуа",
  "Німеччина",
  "Нова Зеландія",
  "Нова Каледонія",
  "Норвегія",
  "о. Іріан-Джая",
  "о. Мадейра",
  "о. Пасхи",
  "о. Сінт-Мартен",
  "о. Тенеріфе",
  "Об'єднані Арабські Емірати (ОАЕ)",
  "Оман",
  "Острів Норфолк",
  "Острів Реюньйон",
  "Острови Теркс і Кайкос",
  "Палау",
  "Панама",
  "Папуа-Нова Гвінея",
  "Парагвай",
  "Перу",
  "Південна Джорджія та Південні Сандвічеві Острови",
  "Південно-Африканська Республіка (ПАР)",
  "Північні Маріанські Острови",
  "Польща",
  "Португалія",
  "Пуерто-Рико",
  "Руанда",
  "Румунія",
  "Сальвадор",
  "Сан-Маріно",
  "Саудівська Аравія",
  "Сейшельські острови",
  "Сен-Бартельмі",
  "Сен-Мартен (голландська частина)",
  "Сен-Мартен (французька частина)",
  "Сен-П'єр і Мікелон",
  "Сент-Кітс та Невіс",
  "Сент-Люсія",
  "Сербія",
  "Сицилія",
  "Сінгапур",
  "Словаччина",
  "Словенія",
  "Соломонові острови",
  "Сполучені Штати Америки (США)",
  "Сурінам",
  "Таджикистан",
  "Таїланд",
  "Тайвань",
  "Танзанія",
  "Тонга",
  "Туніс",
  "Туреччина",
  "Туркменістан",
  "Угорщина",
  "Узбекистан",
  "Уругвай",
  "Фарерські острови",
  "Фіджі",
  "Філіппіни",
  "Фінляндія",
  "Фолклендські (Мальвінські) острови",
  "Франція",
  "Французька Гвіана",
  "Французька Полінезія",
  "Хорватія",
  "Чехія",
  "Чилі",
  "Чорногорія",
  "Швейцарія",
  "Швеція",
  "Шрі-Ланка",
  "Ямайка",
  "Японія",
];

export const travelCountryOptions = travelCountries
  .slice()
  .sort((a, b) => a.localeCompare(b, "uk"))
  .map((c) => ({ value: c, label: c }));

const europeanTravelCountries = new Set([
  "Австрія",
  "Аландські острови",
  "Албанія",
  "Андорра",
  "Бельгія",
  "Болгарія",
  "Боснія і Герцеговина",
  "Ватикан",
  "Великобританія",
  "Гренландія",
  "Греція",
  "Грузія",
  "Данія",
  "Естонія",
  "Ірландія",
  "Ісландія",
  "Іспанія",
  "Італія",
  "Канарські острови",
  "Кіпр",
  "Кріт",
  "Латвія",
  "Литва",
  "Ліхтенштейн",
  "Люксембург",
  "Майорка",
  "Македонія",
  "Мальта",
  "Молдова",
  "Монако",
  "Нідерланди",
  "Німеччина",
  "Норвегія",
  "о. Мадейра",
  "о. Тенеріфе",
  "Польща",
  "Португалія",
  "Румунія",
  "Сан-Маріно",
  "Сербія",
  "Сицилія",
  "Словаччина",
  "Словенія",
  "Угорщина",
  "Фарерські острови",
  "Фінляндія",
  "Франція",
  "Хорватія",
  "Чехія",
  "Чорногорія",
  "Швейцарія",
  "Швеція",
]);

export function isEuropeanTravelCountry(country: string): boolean {
  return europeanTravelCountries.has(country);
}


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



export const autoVehicleOptions = [
  { value: "A1", label: "A1 — Мотоцикли та мотороллери до 300 куб см (включно)" },
  { value: "A2", label: "A2 — Мотоцикли та мотороллери від 300 куб см" },
  { value: "B1", label: "B1 — Легковий автомобіль: до 1600 куб см" },
  { value: "B2", label: "B2 — Легковий автомобіль: 1601 – 2000 куб см" },
  { value: "B3", label: "B3 — Легковий автомобіль: 2001 – 3000 куб см" },
  { value: "B4", label: "B4 — Легковий автомобіль: більше 3000 куб см" },
  {
    value: "B5",
    label: "B5 — Легковий електромобіль (виключно електродвигун, крім гібридів)",
  },
  { value: "C1", label: "C1 — Вантажні: вантажопідйомність до 2 тонн (включно)" },
  { value: "C2", label: "C2 — Вантажні: вантажопідйомність понад 2 тонни" },
  { value: "D1", label: "D1 — Автобуси до 20 місць для сидіння (включно)" },
  { value: "D2", label: "D2 — Автобуси понад 20 місць для сидіння" },
  { value: "E", label: "E — Причепи до вантажних автомобілів" },
  { value: "F", label: "F — Причепи до легкових автомобілів" },
];

export const autoPlateOptions = [
  { value: "ua", label: "Українські номери" },
  { value: "foreign", label: "Іноземні номери" },
];

export const autoTermOptionsUa = [
  { value: "6", label: "6 місяців" },
  { value: "12", label: "1 рік" },
];

export const autoTermOptionsForeign = [
  { value: "15d", label: "15 днів" },
  { value: "21d", label: "21 день" },
  { value: "1", label: "1 місяць" },
  { value: "2", label: "2 місяці" },
  { value: "3", label: "3 місяці" },
  { value: "4", label: "4 місяці" },
  { value: "5", label: "5 місяців" },
  { value: "6", label: "6 місяців" },
  { value: "12", label: "1 рік" },
];

export const AUTO_MIN_DRIVER_AGE = 18;
export const AUTO_MAX_DRIVER_AGE = 90;

export function autoDriverBand(age: number): string {
  return age < 25 ? "young" : "standard";
}

export const productConfigs: Record<ProductKey, ProductConfig> = {
  auto: {
    title: "Калькулятор автоцивілки",
    usesDays: false,
    usesAutoForm: true,
    fields: [
      {
        key: "vehicle",
        label: "Тип (наземний транспортний засіб)",
        options: autoVehicleOptions,
      },
      {
        key: "plates",
        label: "Реєстрація авто",
        options: autoPlateOptions,
      },
      {
        key: "term",
        label: "Строк дії",
        options: [...autoTermOptionsForeign],
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
      "Сума покриття: 30 000 €, франшиза: 0 €",
      "Для мандрівників старше 70 років — індивідуальний розрахунок, франшиза 150 €, термін до 14 днів",
    ],
    fields: [
      {
        key: "country",
        label: "Країна поїздки",
        options: travelCountryOptions,
      },
      {
        key: "zone",
        label: "Територія дії договору",
        options: [
          { value: "schengen", label: "Європа" },
          { value: "world", label: "Весь світ" },
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

export const TRAVEL_MIN_DAYS = 7;
export const TRAVEL_MAX_DAYS = 90;
export const TRAVEL_MAX_AGE = 70;

function parseDmy(value: string): Date | null {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value ?? "");
  if (!m) return null;
  const [, d, mo, y] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(mo) - 1 ||
    date.getDate() !== Number(d)
  )
    return null;
  return date;
}

/** Кількість днів між датами включно (виїзд і приїзд). */
export function travelDays(from: string, to: string): number | null {
  const a = parseDmy(from);
  const b = parseDmy(to);
  if (!a || !b) return null;
  const diff = Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1;
  return diff > 0 ? diff : null;
}

export function ageFromBirthDate(value: string, at: Date = new Date()): number | null {
  const birth = parseDmy(value);
  if (!birth) return null;
  let age = at.getFullYear() - birth.getFullYear();
  const before =
    at.getMonth() < birth.getMonth() ||
    (at.getMonth() === birth.getMonth() && at.getDate() < birth.getDate());
  if (before) age -= 1;
  return age >= 0 && age <= 120 ? age : null;
}

export function travelAgeBand(age: number): string {
  if (age < 1) return "1_3";
  if (age <= 3) return "1_3";
  if (age <= 59) return "4_59";
  if (age <= 65) return "60_65";
  if (age <= 70) return "66_70";
  return "over_70";
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function defaultParams(product: ProductKey): Record<string, string> {
  const config = productConfigs[product];
  const params: Record<string, string> = {};
  for (const field of config.fields) {
    params[field.key] = field.options[0]!.value;
  }
  if (config.usesDays) params["days"] = "10";
  if (config.usesTravelDates) {
    params["date_from"] = todayPlus(1);
    params["date_to"] = todayPlus(TRAVEL_MIN_DAYS);
    params["days"] = String(TRAVEL_MIN_DAYS);
    params["birth_date"] = "";
  }
  if (product === "travel") {
    params["country"] = "Польща";
    params["zone"] = "schengen";
    params["coverage"] = "30000";
    params["franchise"] = "0";
  }
  if (config.usesAutoForm) {
    params["vehicle"] = "B1";
    params["plates"] = "ua";
    params["term"] = "12";
    params["driver_age"] = "30";
    params["region"] = ukraineRegionOptions[0]!.value;
    params["city"] = defaultCityForRegion(ukraineRegionOptions[0]!.value);
    params["privilege"] = "none";
  }
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
  if (config.usesTravelDates) {
    parts.push(`Дата виїзду: ${String(params["date_from"] ?? "—")}`);
    parts.push(`Дата приїзду: ${String(params["date_to"] ?? "—")}`);
    if (params["birth_date"]) parts.push(`Дата народження: ${String(params["birth_date"])}`);
  }
  if (config.usesDays) parts.push(`Кількість днів: ${String(params["days"] ?? "—")}`);
  if (config.usesAutoForm) {
    parts.push(`Вік наймолодшого водія: ${String(params["driver_age"] ?? "—")}`);
    if (String(params["plates"] ?? "") === "ua") {
      const region = ukraineRegions.find((r) => r.value === String(params["region"] ?? ""));
      parts.push(`Область реєстрації власника ТЗ: ${region?.label ?? "—"}`);
      parts.push(`Населений пункт реєстрації: ${String(params["city"] ?? "—")}`);
      const privilege = String(params["privilege"] ?? "none");
      parts.push(
        `Пільгова категорія: ${autoPrivilegeOptions.find((o) => o.value === privilege)?.label ?? "Відсутня"}`,
      );
    }
  }
  if (product === "travel") {
    parts.push(`Сума покриття: ${String(params["coverage"] ?? "30000")} €`);
    parts.push(`Франшиза: ${String(params["franchise"] ?? "0")} €`);
  }
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
  privilege: "Пільгова категорія",
  driver_age: "Вік наймолодшого водія",
  driver: "Категорія водія",
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
  date_from: "Дата виїзду",
  date_to: "Дата приїзду",
  country: "Країна поїздки",
  franchise: "Франшиза",
};

const dateKeys = new Set([
  "birth_date",
  "passport_date",
  "doc_date",
  "start_date",
  "date_from",
  "date_to",
]);


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
    ...(config?.usesTravelDates ? ["date_from", "date_to", "birth_date"] : []),
    ...(config?.usesAutoForm ? ["driver_age", "region", "city", "privilege", "driver"] : []),

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
  return Math.round(price * 100) / 100;
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
  return `${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)} грн`;
}
