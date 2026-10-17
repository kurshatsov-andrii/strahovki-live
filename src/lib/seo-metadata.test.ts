import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { buildBlogMetadata } from "./seo-metadata";
import { BLOG_CATEGORIES } from "./blog-categories";

function routeMetadata() {
  const entries: { title: string; description: string }[] = [];
  function visit(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { visit(path); continue; }
      if (!entry.name.endsWith(".tsx")) continue;
      const text = readFileSync(path, "utf8");
      const title = text.match(/const title = "([^"]+)"/)?.[1] ?? text.match(/\{ title: "([^"]+)"/)?.[1];
      const description = text.match(/const description =\s*"([^"]+)"/)?.[1] ?? text.match(/name: "description", content: "([^"]+)"/)?.[1];
      if (title && description) entries.push({ title, description });
    }
  }
  visit("src/routes");
  return [...entries, ...BLOG_CATEGORIES];
}

describe("SEO metadata requirements", () => {
  it("limits every static page title to 60 characters", () => {
    const items = routeMetadata();
    expect(items.length).toBe(19);
    for (const item of items) expect(item.title.length, item.title).toBeLessThanOrEqual(60);
  });
  it("limits every static page description to 160 characters", () => {
    for (const item of routeMetadata()) expect(item.description.length, item.title).toBeLessThanOrEqual(160);
  });
  it("keeps static page titles unique", () => {
    const items = routeMetadata();
    expect(new Set(items.map((item) => item.title)).size).toBe(items.length);
  });
  it("keeps static page descriptions unique", () => {
    const items = routeMetadata();
    expect(new Set(items.map((item) => item.description)).size).toBe(items.length);
  });
  const posts = ["first", "second", "third"].map((slug) => ({ slug, title: "Автоцивілка та виплати після ДТП ".repeat(8), description: "Умови та документи для отримання виплати. ".repeat(8), content: "" }));
  it("limits generated article titles to 60 characters", () => {
    for (const item of buildBlogMetadata(posts).values()) expect(item.title.length).toBeLessThanOrEqual(60);
  });
  it("limits generated article descriptions to 160 characters", () => {
    for (const item of buildBlogMetadata(posts).values()) expect(item.description.length).toBeLessThanOrEqual(160);
  });
  it("disambiguates identical article titles", () => {
    expect(new Set([...buildBlogMetadata(posts).values()].map((item) => item.title)).size).toBe(3);
  });
  it("disambiguates identical article descriptions", () => {
    expect(new Set([...buildBlogMetadata(posts).values()].map((item) => item.description)).size).toBe(3);
  });
  it("uses a complete description sentence rather than cutting the next sentence", () => {
    const item = buildBlogMetadata([{ slug: "sentence-test", title: "Автоцивілка", description: "Як перевірити автоцивілку онлайн? Наступне дуже довге речення ".repeat(10), content: "" }]).get("sentence-test");
    expect(item?.description).toBe("Як перевірити автоцивілку онлайн?");
  });
  it("replaces an oversized title with a complete topic title, without ellipsis", () => {
    const item = buildBlogMetadata([{ slug: "long-title", title: "Автоцивілка: " + "документи та правила оформлення ".repeat(10), description: "", content: "" }]).get("long-title");
    expect(item?.title).toBe("Автоцивілка: умови страхування та поради");
  });
  it("does not turn an oversized sentence or word into a sentence fragment", () => {
    const item = buildBlogMetadata([{ slug: "long-word", title: "Спортивне страхування " + "а".repeat(200), description: "б".repeat(300), content: "" }]).get("long-word");
    expect(item?.description).toBe("Спортивне страхування: корисна інформація про поліс та відповіді на запитання.");
    expect(item?.title).not.toContain("…");
  });
});