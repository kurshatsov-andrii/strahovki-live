import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/sections/hero";
import { ContactFormSection } from "@/components/sections/contact";
import { ConsultantSection } from "@/components/sections/consultant";
import { breadcrumbScript } from "@/lib/jsonld";

const title = "Страхування в Харкові — контакти консультанта | Страховки";
const description =
  "Контакти страхового консультанта в Харкові: телефони, Viber, Telegram, email та адреса офісу. Зверніться щодо оформлення поліса або умов страхування.";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://strahovki.kh.ua/contacts" },
    ],
    links: [{ rel: "canonical", href: "https://strahovki.kh.ua/contacts" }],
    scripts: [
      breadcrumbScript([
        { name: "Головна", path: "/" },
        { name: "Контакти", path: "/contacts" },
      ]),
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
      <ConsultantSection variant="compact" />
      <ContactFormSection
        title="Зв'яжіться з нами"
        subtitle="Оберіть зручний канал зв'язку або заповніть форму нижче."
      />
    </>
  );
}
