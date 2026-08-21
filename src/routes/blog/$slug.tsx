import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBlogPost } from "@/lib/blog.functions";
import { Button } from "@/components/ui/button";
import { ContactFormSection } from "@/components/sections/contact";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ params, loaderData }) => {
    const url = `https://strahovki.live/blog/${params.slug}`;
    const title = loaderData ? `${loaderData.title} | Страховки` : "Стаття | Страховки";
    const description = loaderData?.description ?? "Стаття про страхування від консультанта Страховки.";
    const image = loaderData?.image_url ?? null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: loaderData.title,
                description: loaderData.description,
                datePublished: loaderData.published_at,
                image: loaderData.image_url ?? undefined,
                author: { "@type": "Person", name: "Куршацов Андрій Іванович" },
                publisher: { "@type": "Organization", name: "Страховки" },
                mainEntityOfPage: url,
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const paragraphs = post.content.split("\n").filter((line) => line.trim().length > 0);

  return (
    <>
      <article className="py-16 md:py-20">
        <div className="container-page max-w-3xl">
          <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary">
            ← Усі статті
          </Link>

          <time
            dateTime={post.published_at}
            className="mt-6 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {formatDate(post.published_at)}
          </time>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h1>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={`Ілюстрація до статті: ${post.title}`}
              className="mt-6 w-full rounded-2xl object-cover"
              loading="lazy"
            />
          )}

          <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/90">
            {paragraphs.slice(1).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/">Оформити страховку</Link>
            </Button>
            {post.source_url && (
              <Button asChild variant="outline">
                <a href={post.source_url} target="_blank" rel="noreferrer">
                  Читати в Telegram
                </a>
              </Button>
            )}
          </div>
        </div>
      </article>

      <ContactFormSection
        title="Потрібна консультація?"
        subtitle="Залиште заявку — підберемо оптимальний поліс під вашу ситуацію."
      />
    </>
  );
}
