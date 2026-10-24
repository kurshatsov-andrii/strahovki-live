// Helpers for schema.org JSON-LD scripts used in route head() definitions.

export const SITE_URL = "https://strahovki.kh.ua";
export const SITE_NAME = "Страховки";
export const CONSULTANT_NAME = "Куршацов Андрій Іванович";

export interface BreadcrumbItem {
  name: string;
  path: string; // e.g. "/" or "/blog"
}

/** BreadcrumbList script for inner pages so Google understands the page hierarchy. */
export function breadcrumbScript(items: BreadcrumbItem[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    }),
  };
}

/** Person schema for the consultant (home and «Про мене»). */
export function personScript() {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: CONSULTANT_NAME,
      jobTitle: "Страховий консультант",
      url: `${SITE_URL}/pro-mene`,
      telephone: "+380664688151",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Харків",
        addressCountry: "UA",
      },
      worksFor: { "@type": "InsuranceAgency", name: SITE_NAME, url: SITE_URL },
    }),
  };
}

/** Organization schema for brand identification (home page). */
export function organizationScript() {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      telephone: "+380664688151",
      email: "info@strahovki.kh.ua",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Харків",
        addressCountry: "UA",
      },
    }),
  };
}

/** FAQPage schema from question/answer groups. */
export function faqPageScript(groups: readonly { items: readonly { question: string; answer: string }[] }[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: groups.flatMap((group) =>
        group.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      ),
    }),
  };
}
