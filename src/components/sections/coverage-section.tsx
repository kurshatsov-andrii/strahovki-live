import { Check, X } from "lucide-react";

export function CoverageSection({
  title,
  validTitle,
  validCountries,
  invalidTitle,
  invalidCountries,
  note,
}: {
  title: string;
  validTitle: string;
  validCountries: string[];
  invalidTitle: string;
  invalidCountries: string[];
  note: string;
}) {
  return (
    <section className="bg-secondary/30 py-20">
      <div className="container-page">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{title}</h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
              <Check className="size-5" /> {validTitle}
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
              {validCountries.map((country) => (
                <li key={country} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span>{country}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="flex items-center gap-2 text-lg font-bold text-destructive">
              <X className="size-5" /> {invalidTitle}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {invalidCountries.map((country) => (
                <li key={country} className="flex items-start gap-2">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <span>{country}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
              {note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
