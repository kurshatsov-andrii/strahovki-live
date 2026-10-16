import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";


import { renderErrorPage } from "./lib/error-page";
import { getLegacyRedirect } from "./lib/legacy-redirects";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// Old WordPress URLs of strahovki.kh.ua → permanent redirect to matching new page.
const legacyRedirectMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (request.method === "GET" || request.method === "HEAD") {
    const url = new URL(request.url);
    const target = getLegacyRedirect(url.pathname);
    if (target && target !== url.pathname) {
      return new Response(null, {
        status: 301,
        headers: { location: new URL(target, url.origin).toString() },
      }) as never;
    }
  }
  return next();
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [legacyRedirectMiddleware, errorMiddleware, csrfMiddleware],
}));
