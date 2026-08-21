import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Страховки" },
      { property: "og:site_name", content: "Страховки" },
      {
        name: "google-site-verification",
        content: "QSrzHKPb2HJV24Dq2oYLzW7pEC9T6FOQKu1mErDqpjI",
      },

      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lovable App" },
      { property: "og:title", content: "Lovable App" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "description", content: "Оформіть автоцивілку, зелену карту, туристичне чи спортивне страхування онлайн за кілька хвилин. Реальні тарифи та електронний поліс." },
      { property: "og:description", content: "Оформіть автоцивілку, зелену карту, туристичне чи спортивне страхування онлайн за кілька хвилин. Реальні тарифи та електронний поліс." },
      { name: "twitter:description", content: "Оформіть автоцивілку, зелену карту, туристичне чи спортивне страхування онлайн за кілька хвилин. Реальні тарифи та електронний поліс." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/fhzHLE2HiFZe0qgeuSJhU49nthl2/social-images/social-1787045393180-social-image.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/fhzHLE2HiFZe0qgeuSJhU49nthl2/social-images/social-1787045393180-social-image.webp" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Страховки — Куршацов Андрій",
          url: "https://strahovki.live",
          telephone: ["+380972520551", "+380664688151"],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Харків",
            addressCountry: "UA",
          },
          openingHours: "Mo-Su 08:00-21:00",
          areaServed: "UA",
        }),
      },
      {
        "data-plerdy_code": "1",
        children: `(function(w,d){
          if(w.__plerdyCode)return;
          w.__plerdyCode=1;
          w._protocol=w.location.protocol=="https:"?"https://":"http://";
          w._site_hash_code="bc832fd6d3245d689f020389aea36c96";
          w._suid=80310;
          var s=d.createElement("script");
          s.async=true;
          s.referrerPolicy="strict-origin-when-cross-origin";
          s.src="https://a.plerdy.com/public/js/click/main.js?v="+Math.random();
          d.head.appendChild(s);
        })(window,document);`,
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
