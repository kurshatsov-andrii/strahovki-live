import { CalendarDays, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const calendarUrl = "https://fartlek.com.ua/calendar";
const calendarAnchor = "Календар забігів 2027";

export function RaceCalendarSection() {
  return (
    <section className="py-12">
      <div className="container-page">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-secondary/40 p-8 sm:flex-row sm:items-center">
          <CalendarDays className="size-8 shrink-0 text-primary" />
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Бігаєш змагання — приєднуйся
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Обери старт у календарі та оформи спортивний поліс на період
              змагань:{" "}
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener"
                className="font-semibold text-primary underline underline-offset-4"
              >
                {calendarAnchor}
              </a>
              .
            </p>
          </div>
          <Button asChild className="shrink-0">
            <a href={calendarUrl} target="_blank" rel="noopener">
              {calendarAnchor}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
