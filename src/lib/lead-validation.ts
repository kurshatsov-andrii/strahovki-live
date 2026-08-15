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
