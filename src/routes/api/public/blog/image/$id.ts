import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/blog/image/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = String(params.id).replace(/[^0-9]/g, "");
        if (!id) return new Response("Not found", { status: 404 });

        const { createClient } = await import("@supabase/supabase-js");
        const key = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
        const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
                headers.delete("Authorization");
              }
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const { data, error } = await supabase.storage.from("blog-images").download(`${id}.jpg`);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
