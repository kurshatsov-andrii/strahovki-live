import { describe, expect, it } from "vitest";
import {
  greenCardCountries,
  greenCardDescription,
  greenCardTitle,
} from "@/content/green-card-countries";
import { getLegacyRedirect } from "@/lib/legacy-redirects";

describe("Green Card country pages", () => {
  it("includes all 10 countries, including the four new destinations", () => {
    expect(greenCardCountries.map((country) => country.path)).toEqual([
      "/zelena-karta-polshcha",
      "/zelena-karta-moldova",
      "/zelena-karta-rumuniia",
      "/zelena-karta-nimechchyna",
      "/zelena-karta-uhorshchyna",
      "/zelena-karta-slovachchyna",
      "/zelena-karta-italiia",
      "/zelena-karta-frantsiia",
      "/zelena-karta-ispaniia",
      "/zelena-karta-bolhariia",
    ]);
  });

  it("uses unique SEO metadata within the required limits", () => {
    const titles = greenCardCountries.map(greenCardTitle);
    const descriptions = greenCardCountries.map(greenCardDescription);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);

    for (const country of greenCardCountries) {
      expect(greenCardTitle(country).length).toBeLessThanOrEqual(60);
      expect(greenCardDescription(country).length).toBeLessThanOrEqual(160);
    }
  });

  it("does not redirect current country pages to another URL", () => {
    for (const country of greenCardCountries) {
      expect(getLegacyRedirect(country.path)).toBeNull();
    }
  });
});
