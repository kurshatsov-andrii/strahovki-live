import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { BlogCategoryNav, BlogList } from "@/components/sections/blog-list";
import { listBlogPosts } from "@/lib/blog.functions";
import { categorizePost, getCategory } from "@/lib/blog-categories";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/kategoriia/$category")({
  loader: async ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    const posts = await listBlogPosts();
    return posts.filter((p) => categorizePost(p)?.slug === cat.slug);
  },
  head: ({ params }) => {
    const cat = getCategory(params.category);
    const url = `https://strahovki.kh.ua/blog/kategoriia/${params.category}`;
    if (!cat) return { meta: [{ title: "Категорія не знайдена | Страховки" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: cat.title },
        { name: "description", content: cat.description },
        { property: "og:title", content: cat.title },
        { property: "og:description", content: cat.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Головна", item: "https://strahovki.kh.ua/" },
              { "@type": "ListItem", position: 2, name: "Блог", item: "https://strahovki.kh.ua/blog" },
              { "@type": "ListItem", position: 3, name: cat.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const posts = Route.useLoaderData();
  const { category } = Route.useParams();
  const cat = getCategory(category)!;

  return (
    <>
      <PageHero eyebrow={`Блог · ${cat.name}`} title={cat.h1} subtitle={cat.intro[0]} />
      <section className="py-16 md:py-20">
        <div className="container-page">
          <BlogCategoryNav active={cat.slug} />
          <BlogList posts={posts} />
          <div className="mt-12 max-w-3xl space-y-4 text-base leading-relaxed text-foreground/90">
            <p>{cat.intro[1]}</p>
            <Button asChild>
              <Link to={cat.productTo}>{cat.productLabel}</Link>
            </Button>
          </div>
        </div>
      </section>
      <ContactFormSection
        title="Потрібна консультація?"
        subtitle="Залиште заявку — підберемо оптимальний поліс під вашу ситуацію."
      />
    </>
  );
}
