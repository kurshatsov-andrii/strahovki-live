import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/hero";
import { ConsultantSection } from "@/components/sections/consultant";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqGroups } from "@/content/faq";

const title = "Питання та відповіді про страхування (FAQ) — Страховки";
const description = "Відповіді про автоцивілку, зелену карту, туристичне та спортивне страхування: ціна, документи, строки, покриття, оформлення онлайн і перевірка поліса.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://strahovki.kh.ua/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Про страхування без зайвих складнощів"
        title="Питання та відповіді"
        subtitle="Що покриває поліс, які документи потрібні та як оформити страховку онлайн — відповіді про автоцивілку, зелену карту, туристичне й спортивне страхування."
      />
      <div className="container-page py-10 sm:py-14">
        <nav aria-label="Теми запитань" className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-3 border-b border-border pb-6">
          {faqGroups.map((group) => (
            <a key={group.id} href={`#${group.id}`} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              {group.title}
            </a>
          ))}
        </nav>
        <div className="mx-auto max-w-3xl">
          {faqGroups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24 border-b border-border py-10 last:border-b-0 sm:py-12">
              <h2 className="text-2xl font-extrabold sm:text-3xl">{group.title}</h2>
              <Accordion type="multiple" className="mt-6">
                {group.items.map((item, index) => (
                  <AccordionItem key={item.question} value={`${group.id}-${index}`}>
                    <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                    <AccordionContent className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button asChild variant="link" className="mt-4 h-auto whitespace-normal px-0 text-left">
                <Link to={group.to}>Оформити: {group.title}<ArrowUpRight /></Link>
              </Button>
            </section>
          ))}
          <section className="border-t border-border pt-10">
            <h2 className="text-2xl font-extrabold">Не знайшли відповідь?</h2>
            <p className="mt-3 text-muted-foreground">Куршацов Андрій Іванович допоможе уточнити умови страхування та підібрати поліс для вашої ситуації.</p>
            <Button asChild className="mt-5"><Link to="/contacts">Поставити запитання</Link></Button>
          </section>
        </div>
      </div>
      <ConsultantSection />
    </>
  );
}