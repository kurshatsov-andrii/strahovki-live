import { describe, expect, it } from "vitest";
import { getLegacyRedirect } from "./legacy-redirects";

describe("legacy redirects", () => {
  it("keeps current pages", () => {
    expect(getLegacyRedirect("/zelena-karta")).toBeNull();
    expect(getLegacyRedirect("/blog/some-post")).toBeNull();
  });
  it("sends popular articles to their blog copy", () => {
    expect(getLegacyRedirect("/dtp-bez-polisa")).toBe("/blog/dtp-bez-polisa");
    expect(getLegacyRedirect("/price-green-card-auto-2026")).toBe("/blog/zelena-karta-na-1-rik-12-133-hrn-vyhidna-tsina-po-ukraini-477");
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
