import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection, ContactInfoSection } from "@/components/sections/contact";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
      <ContactInfoSection />
      <ContactFormSection
        title="Зв'яжіться з нами"
        subtitle="Оберіть зручний канал зв'язку або заповніть форму нижче."
      />
    </>
  );
}
