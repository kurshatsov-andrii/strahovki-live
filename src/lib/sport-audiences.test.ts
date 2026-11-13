import { describe, expect, it } from "vitest";
import {
  sportAudiences,
  sportAudienceDescription,
  sportAudienceTitle,
} from "../content/sport-audiences";

describe("sport audience pages SEO requirements", () => {
  it("covers every audience the site promises", () => {
    expect(sportAudiences.map((a) => a.slug)).toEqual([
      "bihuniv",
      "velosypedystiv",
      "plavtsiv",
      "triatletiv",
    ]);
  });

  it("has unique slugs and genitive forms", () => {
    for (const key of ["slug", "gen"] as const) {
      const values = sportAudiences.map((a) => a[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("keeps titles under 60 characters", () => {
    for (const a of sportAudiences) {
      const title = sportAudienceTitle(a);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toContain("Страхування для");
      expect(title).toContain(a.gen);
    }
  });

  it("keeps descriptions under 160 characters with the core offer", () => {
    for (const a of sportAudiences) {
      const description = sportAudienceDescription(a);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description).toContain("35 000 грн");
      expect(description).toContain("377 грн");
    }
  });

  it("never truncates a title or description mid-word", () => {
    for (const a of sportAudiences) {
      expect(sportAudienceTitle(a)).toMatch(/[а-яіїєґА-ЯІЇЄҐ]$/);
      expect(sportAudienceDescription(a)).toMatch(/[.!?]$/);
    }
  });
});
