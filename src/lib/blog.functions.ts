import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildBlogMetadata } from "@/lib/seo-metadata";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  source_url: string | null;
  published_at: string;
};

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async (): Promise<BlogPost[]> => {
  const { fetchPosts, maybeSync } = await import("@/lib/blog.server");
  await maybeSync();
  return fetchPosts();
});

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }): Promise<(BlogPost & { seo: { title: string; description: string } }) | null> => {
    const { fetchPost, fetchPosts } = await import("@/lib/blog.server");
    const post = await fetchPost(data.slug);
    if (!post) return null;
    const posts = await fetchPosts();
    const seo = buildBlogMetadata([...posts.filter((item) => item.slug !== post.slug), post]).get(post.slug);
    if (!seo) throw new Error("Article metadata unavailable");
    return { ...post, seo };
  });

export const syncBlogPosts = createServerFn({ method: "POST" }).handler(async () => {
  const { syncBlogFromTelegram } = await import("@/lib/blog-sync.server");
  return syncBlogFromTelegram();
});
