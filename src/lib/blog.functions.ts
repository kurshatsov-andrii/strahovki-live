import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const { fetchPost } = await import("@/lib/blog.server");
    return fetchPost(data.slug);
  });

export const syncBlogPosts = createServerFn({ method: "POST" }).handler(async () => {
  const { syncBlogFromTelegram } = await import("@/lib/blog-sync.server");
  return syncBlogFromTelegram();
});
