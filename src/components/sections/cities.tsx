import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { cities } from "@/content/cities";

export function CitiesSection() {
  return (
    <section className="py-12">
      <div className="container-page text-center">
        <h2 className="text-2xl font-bold">Страхування у вашому місті</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Оформлюю поліси онлайн для жителів усієї України — оберіть своє місто.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {cities.map((c) => (
            <Link key={c.slug} to="/strahuvannya/$city" params={{ city: c.slug }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary">
              <MapPin className="size-4 text-primary" /> Страхування {c.inCity}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
