import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { BlogPost } from "@/lib/blog.functions";
import { BLOG_CATEGORIES, categorizePost } from "@/lib/blog-categories";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 9;

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export function BlogCategoryNav({ active }: { active?: string }) {
  const base = "rounded-full border px-4 py-2 text-sm font-medium transition-colors";
  const on = "border-primary bg-primary text-primary-foreground";
  const off = "border-border hover:border-primary hover:text-primary";
  return (
    <nav aria-label="Категорії блогу" className="mb-8 flex flex-wrap gap-2">
      <Link to="/blog" className={`${base} ${!active ? on : off}`}>
        Усі статті
      </Link>
      {BLOG_CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          to="/blog/kategoriia/$category"
          params={{ category: c.slug }}
          className={`${base} ${active === c.slug ? on : off}`}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = posts.slice(0, visible);

  if (posts.length === 0) return <p className="text-muted-foreground">Статті скоро з'являться.</p>;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => {
          const cat = categorizePost(post);
          return (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              {post.image_url && (
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="block bg-muted" aria-label={post.title}>
                  <img
                    src={post.image_url}
                    alt={`Ілюстрація до статті: ${post.title}`}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-contain"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  {cat && (
                    <>
                      <span>·</span>
                      <Link
                        to="/blog/kategoriia/$category"
                        params={{ category: cat.slug }}
                        className="text-primary hover:underline"
                      >
                        {cat.name}
                      </Link>
                    </>
                  )}
                </div>
                <h2 className="text-lg font-bold leading-snug">
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                <p className="line-clamp-4 text-sm text-muted-foreground">{post.description}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="mt-auto text-sm font-semibold text-primary hover:underline"
                >
                  Читати далі →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {visible < posts.length && (
        <div className="mt-10 flex justify-center">
          <Button size="lg" variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Завантажити ще ({posts.length - visible})
          </Button>
        </div>
      )}
    </>
  );
}
