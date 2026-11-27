import { describe, expect, it } from "vitest";
import { travelAudiences } from "@/content/travel-audiences";
import { getLegacyRedirect } from "@/lib/legacy-redirects";

describe("travel audience pages", () => {
  it("titles ≤60, descriptions ≤160, unique, not redirected", () => {
    expect(new Set(travelAudiences.map((a) => a.title)).size).toBe(3);
    for (const a of travelAudiences) {
      expect(a.title.length).toBeLessThanOrEqual(60);
      expect(a.description.length).toBeLessThanOrEqual(160);
      expect(getLegacyRedirect(a.path)).toBeNull();
    }
  });
});
