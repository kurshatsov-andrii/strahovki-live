import { createFileRoute } from "@tanstack/react-router";

async function run() {
  const { syncBlogFromTelegram } = await import("@/lib/blog-sync.server");
  try {
    const result = await syncBlogFromTelegram();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export const Route = createFileRoute("/api/public/blog/sync")({
  server: {
    handlers: {
      GET: run,
      POST: run,
    },
  },
});
