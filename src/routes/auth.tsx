import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const title = "Вхід в адмінпанель — Страховки";
const description = "Авторизація для менеджерів сайту Страховки.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function signInWithGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Не вдалося увійти через Google");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24">
      <div className="container-page mx-auto max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft text-center">
          <h1 className="text-2xl font-extrabold">Вхід в адмінпанель</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Доступ лише для власника сайту через Google-акаунт.
          </p>
          <Button className="mt-6 w-full" onClick={signInWithGoogle} disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Увійти через Google
          </Button>
        </div>
      </div>
    </section>
  );
}
