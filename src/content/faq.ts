import { products } from "@/content/site";

// Reuse the product FAQs so answers stay consistent across the site.
export const faqGroups = [
  { id: "auto", title: "Автоцивілка (ОСЦПВ)", to: "/autostrahuvannya", items: products.auto.faq },
  { id: "green-card", title: "Зелена карта для авто", to: "/zelena-karta", items: products.greenCard.faq },
  { id: "travel", title: "Туристичне медичне страхування за кордон", to: "/turystychne-strahuvannya", items: products.travel.faq },
  { id: "sport", title: "Спортивне страхування", to: "/sportyvne-strahuvannya", items: products.sport.faq },
] as const;