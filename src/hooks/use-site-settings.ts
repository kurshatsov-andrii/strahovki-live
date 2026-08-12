import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteSettings, type SiteSettings } from "@/lib/quotes.functions";
import { site } from "@/content/site";

const fallback: SiteSettings = {
  phone_primary: site.phonePrimary,
  phone_secondary: site.phoneSecondary,
  email: site.email,
  telegram_url: site.telegramUrl,
  viber_url: site.viberUrl,
  facebook_url: site.socials.facebook,
  instagram_url: site.socials.instagram,
  address: site.address,
  working_hours: site.workingHours,
};

export function useSiteSettings(): SiteSettings {
  const fetchSettings = useServerFn(getSiteSettings);
  const query = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 5 * 60 * 1000,
  });
  return query.data ?? fallback;
}
