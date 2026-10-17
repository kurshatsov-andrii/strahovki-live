import { describe, expect, it } from "vitest";
import {
  SPORT_MONTH_MAX,
  SPORT_MONTH_MIN,
  computePrice,
  defaultParams,
  productConfigs,
  sportMonths,
} from "./insurance";

// Тариф EUROINS: знахідка за групою ризику та віком = ціна за 1 місяць.
const coefficients = { group_age: { g1_a2: 295 } };
const sportParams = (months: string) => ({ sport: "g1:bieg", age: "a2", months });

describe("sport insurance term (1 month – 1 year)", () => {
  it("prices one month at the monthly tariff", () => {
    expect(computePrice(1, coefficients, false, sportParams("1"), 1)).toBe(295);
  });

  it("multiplies the monthly tariff by the number of months", () => {
    expect(computePrice(1, coefficients, false, sportParams("3"), 1)).toBe(885);
    expect(computePrice(1, coefficients, false, sportParams("6"), 1)).toBe(1770);
    expect(computePrice(1, coefficients, false, sportParams("12"), 1)).toBe(3540);
  });

  it("keeps the term inside 1 month – 1 year", () => {
    expect(SPORT_MONTH_MIN).toBe(1);
    expect(SPORT_MONTH_MAX).toBe(12);
    expect(sportMonths("24")).toBe(12);
    expect(sportMonths("0")).toBe(1);
    expect(computePrice(1, coefficients, false, sportParams("24"), 1)).toBe(3540);
  });

  it("offers every month from 1 to 12 in the calculator", () => {
    const field = productConfigs.sport.fields.find((f) => f.key === "months");
    expect(field?.label).toBe("Строк дії");
    expect(field?.options.map((o) => o.value)).toEqual([
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
    ]);
    expect(field?.options[0]?.label).toBe("1 місяць");
    expect(field?.options[1]?.label).toBe("2 місяці");
    expect(field?.options[4]?.label).toBe("5 місяців");
    expect(field?.options[11]?.label).toBe("12 місяців (1 рік)");
  });

  it("shows the new term range in the calculator notes", () => {
    expect(productConfigs.sport.notes).toContain("Строк дії: від 1 місяця до 1 року");
  });

  it("defaults the sport term to one year", () => {
    expect(defaultParams("sport")["months"]).toBe("12");
  });

  it("does not apply the month multiplier to other products", () => {
    expect(
      computePrice(1, { zone_term: { europe_30: 500 } }, false, { zone: "europe", term: "30" }, 1),
    ).toBe(500);
  });
});
