import { categorizePost } from "./blog-categories";

export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 160;

export function cleanSeoText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/https?:\/\/\S+/g, " ")
    .replace(/[#*_`]/g, "").replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
    .replace(/\s+/g, " ").trim();
}

export function fitSeoText(value: string, max: number): string {
  const text = cleanSeoText(value);
  const sentences = text.match(/[^.!?…]+[.!?]+(?=\s|$)/g) ?? [];
  let result = "";
  for (const sentence of sentences) {
    const next = [result, sentence.trim()].filter(Boolean).join(" ");
    if (next.length > max) break;
    result = next;
  }
  return result;
}

type SeoPost = { slug: string; title: string; description: string; content: string };

/** Resolve collisions against the published collection, using numbers only when needed. */
export function buildBlogMetadata(posts: SeoPost[]): Map<string, { title: string; description: string }> {
  const result = new Map<string, { title: string; description: string }>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const post of [...posts].sort((a, b) => a.slug.localeCompare(b.slug))) {
    const sourceTitle = cleanSeoText(post.title);
    const topic = categorizePost(post)?.name ?? "Страхування";
    const fallbackTitle = `${topic}: умови страхування та поради`;
    const completeTitle = sourceTitle && !/[.…]$/.test(sourceTitle) && sourceTitle.length <= SEO_TITLE_MAX
      ? sourceTitle : fitSeoText(sourceTitle, SEO_TITLE_MAX) || fallbackTitle;
    let title = completeTitle;
    let index = 2;
    while (titles.has(title)) {
      const suffix = ` — ${index++}`;
      const base = completeTitle.length + suffix.length <= SEO_TITLE_MAX ? completeTitle : `${topic}: поради`;
      title = base + suffix;
    }
    const fallbackDescription = `${topic}: корисна інформація про поліс та відповіді на запитання.`;
    const sourceDescription = fitSeoText(post.description, SEO_DESCRIPTION_MAX)
      || fitSeoText(post.content, SEO_DESCRIPTION_MAX) || fallbackDescription;
    let description = sourceDescription;
    index = 2;
    while (descriptions.has(description)) {
      const suffix = ` Матеріал ${index++}.`;
      description = (fitSeoText(sourceDescription, SEO_DESCRIPTION_MAX - suffix.length) || fallbackDescription) + suffix;
    }
    titles.add(title);
    descriptions.add(description);
    result.set(post.slug, { title, description });
  }
  return result;
}