import { describe, expect, it } from "vitest";
import { getLegacyRedirect } from "./legacy-redirects";

describe("legacy redirects", () => {
  it("keeps current pages", () => {
    expect(getLegacyRedirect("/zelena-karta")).toBeNull();
    expect(getLegacyRedirect("/blog/some-post")).toBeNull();
  });
  it("maps old pages", () => {
    expect(getLegacyRedirect("/ru/desheva-green-card-auto")).toBe("/zelena-karta");
    expect(getLegacyRedirect("/shop/autostrahovky/autostrahovka")).toBe("/autostrahuvannya");
    expect(getLegacyRedirect("/shop/turistichni-strahovki/strahovka-v-turkey")).toBe("/turystychne-strahuvannya");
    expect(getLegacyRedirect("/shop/strahovki-dlya-sportsmeniv/sport-strahovka")).toBe("/sportyvne-strahuvannya");
    expect(getLegacyRedirect("/ru")).toBe("/");
    expect(getLegacyRedirect("/strahovanie-imuschestva-kvartiry")).toBe("/");
  });
});
