import { ageFromBirthDate, travelAgeBand } from "@/lib/insurance";

/** Базові ціни за 7 днів, Європа (грн). */
const BASE_7_DAYS_EUROPE: Record<string, Record<string, number>> = {
  standard: {
    "1_3": 350.07,
    "4_59": 292.52,
    "60_65": 467.52,
    "66_70": 584.52,
  },
  active: {
    "1_3": 385.32,
    "4_59": 321.54,
    "60_65": 514.43,
    "66_70": 643.04,
  },
};

/** Базові ціни за 7 днів, Весь світ (грн). */
const BASE_7_DAYS_WORLD: Record<string, Record<string, number>> = {
  standard: {
    "1_3": 1361.83,
    "4_59": 1136.23,
    "60_65": 1818.44,
    "66_70": 2272.96,
  },
  active: {
    "1_3": 1497.79,
    "4_59": 1250.08,
    "60_65": 2000.15,
    "66_70": 2500.21,
  },
};

/** Коефіцієнт за кожний додатковий день понад 7. */
export const TRAVEL_EXTRA_DAY_FACTOR = 1.122;

/**
 * Приблизна вартість туристичного полісу (Європа або Весь світ).
 * Повертає null, якщо параметрів недостатньо.
 */
export function travelPolicyPrice(params: Record<string, string>): number | null {
  const zone = params["zone"] ?? "schengen";
  const table = zone === "schengen" ? BASE_7_DAYS_EUROPE : BASE_7_DAYS_WORLD;

  const activity = params["activity"] === "active" ? "active" : "standard";

  const age = params["birth_date"] ? ageFromBirthDate(params["birth_date"]) : null;
  if (age === null) return null;

  const band = travelAgeBand(age);
  const base = table[activity]?.[band];
  if (!base) return null;

  const days = Math.max(7, Number(params["days"] ?? 7) || 7);
  const extraDays = days - 7;
  const perExtraDay = (base / 7) * TRAVEL_EXTRA_DAY_FACTOR;

  return Math.round((base + extraDays * perExtraDay) * 100) / 100;
}
