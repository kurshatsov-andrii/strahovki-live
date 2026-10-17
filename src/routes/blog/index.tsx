import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { BlogCategoryNav, BlogList } from "@/components/sections/blog-list";
import { listBlogPosts } from "@/lib/blog.functions";

const title = "Блог про страхування — тарифи, правила та поради";
const description =
  "Статті про автоцивілку, зелену карту, медичну страховку за кордон і спортивне страхування. Пояснення правил, виплат, документів та вибору поліса.";

export const Route = createFileRoute("/blog/")({
  loader: () => listBlogPosts(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://strahovki.kh.ua/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/blog" }],
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
          <BlogCategoryNav />
          <BlogList posts={posts} />
        </div>
      </section>
      <ContactFormSection
        title="Потрібна консультація?"
        subtitle="Залиште заявку — підберемо оптимальний поліс під вашу ситуацію."
      />
    </>
  );
}
