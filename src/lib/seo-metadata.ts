export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 160;

export function cleanSeoText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/https?:\/\/\S+/g, " ")
    .replace(/[#*_`]/g, "").replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
    .replace(/\s+/g, " ").trim();
}

export function fitSeoText(value: string, max: number): string {
  const text = cleanSeoText(value);
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const boundary = slice.lastIndexOf(" ");
  return `${(boundary > max / 2 ? slice.slice(0, boundary) : slice).replace(/[\s,;:—–-]+$/, "")}…`;
}

type SeoPost = { slug: string; title: string; description: string; content: string };

/** Resolve collisions against the published collection, using numbers only when needed. */
export function buildBlogMetadata(posts: SeoPost[]): Map<string, { title: string; description: string }> {
  const result = new Map<string, { title: string; description: string }>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const post of [...posts].sort((a, b) => a.slug.localeCompare(b.slug))) {
    const sourceTitle = cleanSeoText(post.title) || cleanSeoText(post.slug.replace(/-/g, " ")) || "Поради про страхування";
    let title = fitSeoText(sourceTitle, SEO_TITLE_MAX);
    let index = 2;
    while (titles.has(title)) {
      const suffix = ` — ${index++}`;
      title = fitSeoText(sourceTitle, SEO_TITLE_MAX - suffix.length) + suffix;
    }
    const body = cleanSeoText(post.description) || cleanSeoText(post.content) || "Умови страхування та поради щодо оформлення поліса онлайн.";
    const sourceDescription = `${sourceTitle}. ${body}`;
    let description = fitSeoText(sourceDescription, SEO_DESCRIPTION_MAX);
    index = 2;
    while (descriptions.has(description)) {
      const suffix = ` Матеріал ${index++}.`;
      description = fitSeoText(sourceDescription, SEO_DESCRIPTION_MAX - suffix.length) + suffix;
    }
    titles.add(title);
    descriptions.add(description);
    result.set(post.slug, { title, description });
  }
  return result;
}