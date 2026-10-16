import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBlogPost } from "@/lib/blog.functions";
import { Button } from "@/components/ui/button";
import { ContactFormSection } from "@/components/sections/contact";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

const PRODUCT_LINKS: { pattern: RegExp; to: string }[] = [
  { pattern: /автоцивілк[аиуою]|ОСЦПВ|ОСАГО/i, to: "/autostrahuvannya" },
  { pattern: /зелен[аауої]\s+карт[ациуі]/i, to: "/zelena-karta" },
  { pattern: /туристичн[аеомуі]+\s+страхуванн[яюі]/i, to: "/turystychne-strahuvannya" },
  { pattern: /спортивн[аеомуі]+\s+страхуванн[яюі]/i, to: "/sportyvne-strahuvannya" },
];

function linkifyParagraph(text: string, linked: Set<string>) {
  for (const { pattern, to } of PRODUCT_LINKS) {
    if (linked.has(to)) continue;
    const match = text.match(pattern);
    if (!match || match.index === undefined) continue;
    linked.add(to);
    return (
      <>
        {text.slice(0, match.index)}
        <Link to={to} className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
          {match[0]}
        </Link>
        {text.slice(match.index + match[0].length)}
      </>
    );
  }
  return text;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ params, loaderData }) => {
    const url = `https://strahovki.kh.ua/blog/${params.slug}`;
    const title = loaderData ? `${loaderData.title} | Страховки` : "Стаття | Страховки";
    const description = loaderData?.description ?? "Стаття про страхування від консультанта Страховки.";
    const rawImage = loaderData?.image_url ?? null;
    const image = rawImage?.startsWith("/") ? `https://strahovki.kh.ua${rawImage}` : rawImage;

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
            {(() => {
              const linked = new Set<string>();
              return paragraphs.slice(1).map((line, i) =>
                line.startsWith("## ") ? (
                  <h2 key={i} className="pt-4 text-xl font-bold text-foreground md:text-2xl">
                    {line.slice(3)}
                  </h2>
                ) : (
                  <p key={i}>{linkifyParagraph(line, linked)}</p>
                ),
              );
            })()}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-bold">Оформіть страхування онлайн</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link to="/autostrahuvannya" className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
                Автоцивілка (ОСЦПВ) →
              </Link>
              <Link to="/zelena-karta" className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
                Зелена карта →
              </Link>
              <Link to="/turystychne-strahuvannya" className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
                Туристичне страхування →
              </Link>
              <Link to="/sportyvne-strahuvannya" className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
                Спортивне страхування →
              </Link>
            </div>
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
