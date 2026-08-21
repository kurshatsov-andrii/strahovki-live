import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const CHANNEL = "strahovki_kh_ua";
const CHANNEL_URL = `https://t.me/s/${CHANNEL}`;
// Публікуємо у блог статті починаючи з цієї дати
const START_DATE = "2026-07-16";

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
  з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n",
  о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", ъ: "", ы: "y", э: "e",
  ё: "e",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\u200b/g, "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripEmoji(value: string): string {
  return value
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21FF}\u{2B05}-\u{2B07}\u{203C}\u{2049}\u{20E3}\u{E0020}-\u{E007F}]/gu,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

export type ParsedPost = {
  telegram_message_id: number;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  source_url: string;
  published_at: string;
  slug: string;
};

export function parseChannelHtml(html: string, startDate = START_DATE): ParsedPost[] {
  const blocks = html.split('class="tgme_widget_message_wrap').slice(1);
  const posts: ParsedPost[] = [];

  for (const block of blocks) {
    const dateMatch = block.match(/datetime="([^"]+)"/);
    const postMatch = block.match(/data-post="[^/]+\/(\d+)"/);
    const textMatch = block.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    const photoMatch = block.match(
      /tgme_widget_message_photo_wrap[^"]*"\s*style="background-image:url\('([^']+)'\)/,
    );
    if (!dateMatch || !postMatch || !textMatch) continue;
    const publishedAt = dateMatch[1] ?? "";
    if (publishedAt.slice(0, 10) < startDate) continue;

    const text = htmlToText(textMatch[1] ?? "");
    if (!text) continue;

    const lines = text.split("\n").filter(Boolean);
    const rawTitle = lines[0] ?? "";
    const title = stripEmoji(rawTitle).replace(/^[-–—\s]+/, "") || "Новина зі страхування";
    const body = lines.slice(1).join("\n\n").trim() || text;
    const description = stripEmoji(body.replace(/\n+/g, " ")).slice(0, 157).trim();
    const id = Number(postMatch[1] ?? 0);

    posts.push({
      telegram_message_id: id,
      title: title.slice(0, 200),
      description,
      content: text,
      image_url: photoMatch?.[1] ?? null,
      source_url: `https://t.me/${CHANNEL}/${id}`,
      published_at: publishedAt,
      slug: `${slugify(title) || "post"}-${id}`,
    });
  }

  return posts;
}

function adminClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export async function syncBlogFromTelegram(): Promise<{ synced: number; total: number }> {
  const res = await fetch(CHANNEL_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; StrahovkiBot/1.0)" },
  });
  if (!res.ok) throw new Error(`Telegram fetch failed [${res.status}]`);
  const html = await res.text();
  const posts = parseChannelHtml(html);
  if (posts.length === 0) return { synced: 0, total: 0 };

  const supabase = adminClient();
  const { data: existing, error: readError } = await supabase
    .from("blog_posts")
    .select("telegram_message_id");
  if (readError) throw new Error(readError.message);

  const known = new Set((existing ?? []).map((r) => r.telegram_message_id));
  const fresh = posts.filter((p) => !known.has(p.telegram_message_id));
  if (fresh.length === 0) return { synced: 0, total: posts.length };

  const { error } = await supabase.from("blog_posts").insert(fresh);
  if (error) throw new Error(error.message);

  return { synced: fresh.length, total: posts.length };
}
