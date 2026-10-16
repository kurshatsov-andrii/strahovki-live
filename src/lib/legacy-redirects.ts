// 301-redirects for URLs of the old WordPress site on strahovki.kh.ua,
// so Google transfers rankings to the matching new pages.

const CURRENT_PATHS = new Set([
  "/",
  "/autostrahuvannya",
  "/zelena-karta",
  "/turystychne-strahuvannya",
  "/sportyvne-strahuvannya",
  "/contacts",
  "/blog",
  "/privacy",
  "/offer",
  "/auth",
  "/admin",
  "/sitemap.xml",
  "/robots.txt",
]);

const RULES: Array<[RegExp, string]> = [
  [/green-?card|zelen[aey]?-?kart|zelenaya-karta/, "/zelena-karta"],
  [/sport|zmagan|sorevnovan|travm/, "/sportyvne-strahuvannya"],
  [
    /auto|avto|oscpv|osago|dtp|europrotocol|dcv|kasko|regress|pilha|polic|docs-for-auto|inozem|prichep|electrocar/,
    "/autostrahuvannya",
  ],
  [
    /tour|turist|travel|kordon|yevrop|europe|etias|strahovka-v-|med|covid|koronavirus|gory|schengen|visa|viza|vizy|granic|turkey|abroad|vyezd|viezd|poihat|otdy|pohod|puteshest|turyst/,
    "/turystychne-strahuvannya",
  ],
  [/testimonials|kontakt|contact|otzyv|vidguk/, "/contacts"],
  [/blog/, "/blog"],
  [/offer/, "/offer"],
  [/privacy|policy/, "/privacy"],
];

export function getLegacyRedirect(pathname: string): string | null {
  let path = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (CURRENT_PATHS.has(path)) return null;
  if (
    path.startsWith("/blog/") ||
    path.startsWith("/api/") ||
    path.startsWith("/admin") ||
    path.startsWith("/assets/") ||
    path.startsWith("/_") ||
    path.startsWith("/@") ||
    path.startsWith("/src/") ||
    path.startsWith("/node_modules/")
  ) {
    // blog/<page> pagination of the old site → blog list
    return /^\/blog\/page\/\d+$/.test(path) ? "/blog" : null;
  }
  // Static files of the new site (images, icons, etc.) are not legacy URLs,
  // except old WordPress uploads.
  if (!path.startsWith("/wp-") && /\.[a-z0-9]{2,5}$/.test(path)) return null;

  if (path === "/ru") return "/";
  for (const [re, target] of RULES) if (re.test(path)) return target;
  return "/";
}
