import { describe, expect, it } from "vitest";
import { cities, cityDescription, cityTitle } from "../content/cities";

describe("city pages SEO requirements", () => {
  it("covers every city the site promises", () => {
    expect(cities.map((c) => c.slug)).toEqual([
      "kharkiv", "kyiv", "dnipro", "poltava", "uzhhorod", "vinnytsia", "lviv", "sumy",
      "odesa", "rivne", "ternopil", "zaporizhzhia", "lutsk", "kropyvnytskyi", "kherson",
      "zhytomyr", "ivano-frankivsk", "mykolaiv", "chernivtsi", "chernihiv", "cherkasy", "khmelnytskyi",
    ]);
  });

  it("has unique slugs, names and locative forms", () => {
    for (const key of ["slug", "name", "inCity"] as const) {
      const values = cities.map((c) => c[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("keeps titles under 60 characters with both auto products", () => {
    for (const city of cities) {
      const title = cityTitle(city);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toContain("автоцивілка");
      expect(title).toContain("зелена карта");
    }
  });

  it("keeps descriptions under 160 characters naming all four products", () => {
    for (const city of cities) {
      const description = cityDescription(city);
      expect(description.length).toBeLessThanOrEqual(160);
      for (const product of ["автоцивілка", "зелена карта", "турстрахування", "спортстрахування"]) {
        expect(description).toContain(product);
      }
      expect(description).toContain("оформлюю особисто");
    }
  });

  it("never truncates a title or description mid-word", () => {
    for (const city of cities) {
      expect(cityTitle(city)).toMatch(/[а-яіїєґА-ЯІЇЄҐ]$/);
      expect(cityDescription(city)).toMatch(/[.!?]$/);
    }
  });
});
