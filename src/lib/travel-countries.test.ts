import { describe, expect, it } from "vitest";
import { travelCountries, travelDescription, travelTitle, travelH1 } from "@/content/travel-countries";
import { getLegacyRedirect } from "@/lib/legacy-redirects";

describe("travel country pages", () => {
  it("has the 9 requested countries", () => {
    expect(travelCountries.map((c) => c.path)).toEqual([
      "/strahovka-v-polshchu", "/strahovka-v-bolhariiu", "/strahovka-v-moldovu", "/strahovka-v-rumuniiu",
      "/strahovka-v-nimechchynu", "/strahovka-v-turechchynu", "/strahovka-v-uhorshchynu",
      "/strahovka-v-slovachchynu", "/strahovka-v-chekhiiu",
    ]);
  });
  it("Poland matches the brief", () => {
    const p = travelCountries[0];
    expect(travelTitle(p)).toBe("Туристична страховка в Польщу — ціна та оформлення онлайн");
    expect(travelH1(p)).toBe("Туристична страховка в Польщу для українців");
  });
  it("titles ≤60, descriptions ≤160, no legacy redirect", () => {
    for (const c of travelCountries) {
      expect(travelTitle(c).length).toBeLessThanOrEqual(60);
      expect(travelDescription(c).length).toBeLessThanOrEqual(160);
      expect(getLegacyRedirect(c.path)).toBeNull();
    }
  });
});
