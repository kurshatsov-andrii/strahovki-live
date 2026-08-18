import { z } from "zod";

const phoneRegex = /^\+?[0-9\s()\-]{10,20}$/;
const nameRegex = /^[А-ЯҐЄІЇа-яґєіїA-Za-z'’\- ]+$/;

export const emailField = z
  .string()
  .trim()
  .min(1, "Вкажіть email")
  .email("Некоректний email")
  .max(255, "Максимум 255 символів");

export const phoneField = z
  .string()
  .trim()
  .min(1, "Вкажіть номер телефону")
  .regex(phoneRegex, "Формат: +380XXXXXXXXX");

export const personNameField = z
  .string()
  .trim()
  .min(2, "Мінімум 2 символи")
  .max(100, "Максимум 100 символів")
  .regex(nameRegex, "Лише літери");

export const messageField = z.string().trim().max(1000, "Максимум 1000 символів").optional();

export const contactLeadSchema = z.object({
  name: personNameField,
  phone: phoneField,
  email: emailField,
  message: messageField,
});

export const simpleLeadSchema = z.object({
  name: personNameField,
  phone: phoneField,
  email: emailField,
  message: messageField,
});

const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;

function parseDMY(value: string) {
  const match = value.match(dateRegex);
  if (!match) return null;
  const [, d, m, y] = match;
  const day = Number(d);
  const month = Number(m);
  const year = Number(y);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function isValidDate(value: string, { maxToday = true, minYear = 1900 } = {}) {
  const date = parseDMY(value);
  if (!date) return false;
  if (date.getFullYear() < minYear) return false;
  if (maxToday && date.getTime() > Date.now()) return false;
  return true;
}

export const sportLeadSchema = z.object({
  last_name: personNameField,
  first_name: personNameField,
  middle_name: personNameField,
  birth_date: z
    .string()
    .trim()
    .min(1, "Вкажіть дату народження")
    .refine((v) => isValidDate(v), "Некоректна дата. Формат: дд.мм.рррр")
    .refine((v) => {
      const d = parseDMY(v);
      if (!d) return false;
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
      return age >= 1 && age <= 100;
    }, "Вік має бути від 1 до 100 років"),
  tax_id: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "ІПН має містити 10 цифр"),
  passport_number: z
    .string()
    .trim()
    .min(6, "Мінімум 6 символів")
    .max(30, "Максимум 30 символів"),
  passport_issuer: z.string().trim().min(3, "Мінімум 3 символи").max(200, "Максимум 200 символів"),
  passport_date: z
    .string()
    .trim()
    .min(1, "Вкажіть дату видачі")
    .refine((v) => isValidDate(v), "Некоректна дата. Формат: дд.мм.рррр"),
  address: z.string().trim().min(5, "Вкажіть повну адресу").max(200, "Максимум 200 символів"),
  viber_phone: phoneField,
  email: emailField,
  message: messageField,
});

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}

const latinMessage = "Заповніть латиницею (англійськими літерами)";
const latinRegex = /^[A-Za-z0-9\s'’.,\-\/№#()]+$/;

const latinOptionalText = (max = 100) =>
  z
    .string()
    .trim()
    .max(max, `Максимум ${max} символів`)
    .refine((v) => v === "" || latinRegex.test(v), latinMessage)
    .optional();
const latinRequiredText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `Мінімум ${min} символи`)
    .max(max, `Максимум ${max} символів`)
    .regex(latinRegex, latinMessage);
const latinNameField = z
  .string()
  .trim()
  .min(2, "Мінімум 2 символи")
  .max(100, "Максимум 100 символів")
  .regex(/^[A-Za-z'’\- ]+$/, latinMessage);
const numberText = (label: string, max = 10) =>
  z
    .string()
    .trim()
    .regex(/^\d{1,10}$/, `${label}: лише цифри`)
    .max(max);

export const greenCardLeadSchema = z
  .object({
    start_date: z
      .string()
      .trim()
      .min(1, "Вкажіть дату початку дії")
      .refine((v) => isValidDate(v, { maxToday: false }), "Некоректна дата. Формат: дд.мм.рррр")
      .refine((v) => {
        const d = parseDMY(v);
        if (!d) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const min = new Date(today);
        min.setDate(min.getDate() + 1);
        const max = new Date(today);
        max.setMonth(max.getMonth() + 3);
        return d.getTime() >= min.getTime() && d.getTime() <= max.getTime();
      }, "Дата має бути від завтра і не пізніше ніж через 3 місяці"),
    last_name: latinNameField,
    first_name: latinNameField,
    middle_name: latinOptionalText(100),
    birth_date: z
      .string()
      .trim()
      .min(1, "Вкажіть дату народження")
      .refine((v) => isValidDate(v), "Некоректна дата. Формат: дд.мм.рррр"),
    tax_id: z.string().trim().regex(/^\d{10}$/, "ІПН має містити 10 цифр"),
    doc_type: z.string().trim().min(3, "Оберіть документ").max(100),
    doc_series: latinOptionalText(10),
    doc_number: latinRequiredText(4, 30),
    doc_issuer: latinRequiredText(2, 200),
    doc_date: z
      .string()
      .trim()
      .min(1, "Вкажіть дату видачі")
      .refine((v) => isValidDate(v), "Некоректна дата. Формат: дд.мм.рррр"),
    region: latinRequiredText(2, 100),
    city: latinRequiredText(2, 100),
    street: latinRequiredText(2, 150),
    house: latinRequiredText(1, 20),
    apartment: latinOptionalText(20),
    phone: phoneField,
    viber_phone: phoneField,
    email: emailField,
    plate: latinRequiredText(4, 20),
    vehicle_type: z.string().trim().min(1, "Оберіть тип ТЗ").max(100),
    vin: latinOptionalText(30),
    car_brand: latinRequiredText(1, 60),
    car_model: latinRequiredText(1, 60),
    car_year: z
      .string()
      .trim()
      .regex(/^(19|20)\d{2}$/, "Рік у форматі 2020"),
    seats: numberText("К-сть місць", 3),
    mass_total: numberText("Повна маса", 7),
    mass_empty: numberText("Маса без навантаження", 7),
    engine_volume: latinOptionalText(10),
    power_kw: latinOptionalText(10),
    message: messageField,
  })
  .refine((data) => Boolean(data.engine_volume?.trim() || data.power_kw?.trim()), {
    message: "Вкажіть об'єм двигуна або потужність у кВт (для електромобіля)",
    path: ["engine_volume"],
  })
  .refine(
    (data) =>
      data.doc_type.toLowerCase().includes("id") || Boolean(data.doc_series?.trim()),
    { message: "Вкажіть серію документа", path: ["doc_series"] },
  );

const anyText = (min: number, max: number, label = "Заповніть поле") =>
  z.string().trim().min(min, min <= 1 ? label : `Мінімум ${min} символи`).max(max, `Максимум ${max} символів`);
const optionalText = (max: number) =>
  z.string().trim().max(max, `Максимум ${max} символів`).optional();
const optionalDate = z
  .string()
  .trim()
  .refine((v) => v === "" || isValidDate(v, { maxToday: false }), "Некоректна дата. Формат: дд.мм.рррр")
  .optional();

export const autoLeadSchema = z
  .object({
    start_date: z
      .string()
      .trim()
      .min(1, "Вкажіть дату початку дії")
      .refine((v) => isValidDate(v, { maxToday: false }), "Некоректна дата. Формат: дд.мм.рррр")
      .refine((v) => {
        const d = parseDMY(v);
        if (!d) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const min = new Date(today);
        min.setDate(min.getDate() + 1);
        const max = new Date(today);
        max.setMonth(max.getMonth() + 3);
        return d.getTime() >= min.getTime() && d.getTime() <= max.getTime();
      }, "Дата має бути від завтра і не пізніше ніж через 3 місяці"),
    last_name: personNameField,
    first_name: personNameField,
    middle_name: personNameField,
    birth_date: z
      .string()
      .trim()
      .min(1, "Вкажіть дату народження")
      .refine((v) => isValidDate(v), "Некоректна дата. Формат: дд.мм.рррр"),
    tax_id: z.string().trim().regex(/^\d{10}$/, "ІПН має містити 10 цифр"),
    address: anyText(5, 250, "Вкажіть адресу"),
    address_fact: optionalText(250),
    phone: phoneField,
    viber_phone: phoneField,
    doc_type: anyText(3, 100, "Оберіть тип документа"),
    doc_number: anyText(4, 40, "Вкажіть номер документа"),
    doc_date: z
      .string()
      .trim()
      .min(1, "Вкажіть дату видачі")
      .refine((v) => isValidDate(v), "Некоректна дата. Формат: дд.мм.рррр"),
    doc_valid_until: optionalDate,
    doc_issuer: anyText(3, 200, "Вкажіть, ким виданий"),
    car_brand: anyText(1, 60, "Вкажіть марку"),
    car_model: anyText(1, 60, "Вкажіть модель"),
    car_model_note: optionalText(60),
    reg_country: anyText(2, 60, "Вкажіть країну реєстрації"),
    plate: anyText(4, 20, "Вкажіть держномер"),
    vin: optionalText(30),
    car_year: z
      .string()
      .trim()
      .regex(/^(19|20)\d{2}$/, "Рік у форматі 2020"),
    engine_volume: optionalText(10),
    car_color: optionalText(40),
    power_kw: optionalText(10),
    mass_total: numberText("Повна маса", 7),
    mass_empty: numberText("Маса без навантаження", 7),
    seats: numberText("К-сть місць", 3),
    email: emailField,
    message: messageField,
  })
  .refine((data) => Boolean(data.engine_volume?.trim() || data.power_kw?.trim()), {
    message: "Вкажіть об'єм двигуна або потужність у кВт (для електромобіля)",
    path: ["engine_volume"],
  });
