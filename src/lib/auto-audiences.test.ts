import { describe, expect, it } from "vitest";
import { autoAudiences } from "@/content/auto-audiences";
import { getLegacyRedirect } from "@/lib/legacy-redirects";

describe("auto audience pages", () => {
  it("has the five requested pages", () => {
    expect(autoAudiences.map((a) => a.path)).toEqual([
      "/avtotsyvilka-dlia-ubd",
      "/avtotsyvilka-dlia-pensioneriv",
      "/avtotsyvilka-dlia-elektromobilia",
      "/avtotsyvilka-na-inozemni-nomera",
      "/strahovka-na-yevronomery",
    ]);
  });

  it("uses unique search metadata within the length limits", () => {
    expect(new Set(autoAudiences.map((a) => a.title)).size).toBe(autoAudiences.length);
    expect(new Set(autoAudiences.map((a) => a.description)).size).toBe(autoAudiences.length);
    for (const audience of autoAudiences) {
      expect(audience.title.length).toBeLessThanOrEqual(60);
      expect(audience.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("keeps every new page out of legacy redirects", () => {
    for (const audience of autoAudiences) {
      expect(getLegacyRedirect(audience.path)).toBeNull();
    }
  });
});
