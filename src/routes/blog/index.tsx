import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { listBlogPosts } from "@/lib/blog.functions";

const title = "Блог про страхування — поради та новини | Страховки";
const description =
  "Корисні статті про автоцивілку, зелену карту, туристичне та спортивне страхування: тарифи, правила, поради від страхового консультанта.";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export const Route = createFileRoute("/blog/")({
  loader: () => listBlogPosts(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://strahovki.live/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.live/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="Блог"
        title="Статті про страхування"
        subtitle="Поради, новини та розбори від страхового консультанта Куршацова Андрія."
      />

      <section className="py-16 md:py-20">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">Статті скоро з'являться.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={`Ілюстрація до статті: ${post.title}`}
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <time
                      dateTime={post.published_at}
                      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      {formatDate(post.published_at)}
                    </time>
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
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactFormSection
        title="Потрібна консультація?"
        subtitle="Залиште заявку — підберемо оптимальний поліс під вашу ситуацію."
      />
    </>
  );
}
