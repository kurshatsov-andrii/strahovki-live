import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";

const title = "Контакти — Страховки";
const description =
  "Телефон, email, Telegram, Viber та адреса офісу. Залиште заявку — відповімо протягом кількох хвилин.";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://strahovki.live/contacts" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.live/contacts" }],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Завжди на зв'язку"
        title="Контакти"
        subtitle="Телефонуйте, пишіть у месенджер або залиште заявку — відповімо протягом кількох хвилин у робочий час."
      />
      <ConsultantSection variant="compact" />
      <ContactFormSection
        title="Зв'яжіться з нами"
        subtitle="Оберіть зручний канал зв'язку або заповніть форму нижче."
      />
    </>
  );
}
