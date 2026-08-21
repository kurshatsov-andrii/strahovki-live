import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://strahovki.live";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/autostrahuvannya", changefreq: "weekly", priority: "0.9" },
          { path: "/zelena-karta", changefreq: "weekly", priority: "0.9" },
          { path: "/turystychne-strahuvannya", changefreq: "weekly", priority: "0.9" },
          { path: "/sportyvne-strahuvannya", changefreq: "weekly", priority: "0.9" },
          { path: "/blog", changefreq: "daily", priority: "0.8" },
          { path: "/contacts", changefreq: "monthly", priority: "0.6" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/offer", changefreq: "yearly", priority: "0.3" },
        ];

        try {
          const { fetchPosts } = await import("@/lib/blog.server");
          const posts = await fetchPosts();
          for (const post of posts) {
            entries.push({ path: `/blog/${post.slug}`, changefreq: "monthly", priority: "0.7" });
          }
        } catch (error) {
          console.error("[sitemap] blog posts unavailable", error);
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
