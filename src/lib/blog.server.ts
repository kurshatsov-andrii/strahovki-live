import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { BlogPost } from "@/lib/blog.functions";
import { syncBlogFromTelegram } from "@/lib/blog-sync.server";

const SELECT = "slug, title, description, content, image_url, source_url, published_at";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
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

export async function fetchPosts(): Promise<BlogPost[]> {
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select(SELECT)
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as BlogPost[];
}

export async function fetchPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select(SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as BlogPost | null) ?? null;
}

// Автоматичне підтягування нових статей із Telegram — не частіше ніж раз на годину
const SYNC_INTERVAL_MS = 60 * 60 * 1000;
let lastSync = 0;

export async function maybeSync(): Promise<void> {
  const now = Date.now();
  if (now - lastSync < SYNC_INTERVAL_MS) return;
  lastSync = now;
  try {
    await syncBlogFromTelegram();
  } catch (error) {
    console.error("[blog] sync failed", error);
  }
}
