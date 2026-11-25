import { TriangleAlert } from "lucide-react";
import { greenCardRestrictions } from "@/lib/green-card-restrictions";

export function GreenCardRestrictions() {
  return (
    <section className="py-12" aria-labelledby="green-card-restrictions-title">
      <div className="container-page">
        <div className="mx-auto max-w-3xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-1 size-6 shrink-0 text-destructive" aria-hidden="true" />
            <div>
              <h2 id="green-card-restrictions-title" className="text-2xl font-bold">
                Для яких авто Зелена карта не оформлюється
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Для наведених поєднань марки та моделі транспортного засобу оформлення
                Зеленої карти недоступне.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card">
            <table className="w-full table-fixed border-collapse text-left text-sm sm:table-auto sm:text-base">
              <thead className="bg-secondary/70">
                <tr>
                  <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-4">Марка авто</th>
                  <th scope="col" className="break-words px-2 py-3 font-semibold sm:px-4">Модель авто</th>
                </tr>
              </thead>
              <tbody>
                {greenCardRestrictions.map((restriction) => (
                  <tr key={restriction.brand} className="border-t border-border">
                    <td className="break-words px-2 py-3 align-top font-medium sm:px-4">{restriction.brand}</td>
                    <td className="break-words px-2 py-3 align-top sm:px-4">{restriction.models.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Обмеження стосується лише зазначених поєднань марки й моделі. Інші моделі цих
            марок можна оформити за стандартною процедурою.
          </p>
        </div>
      </div>
    </section>
  );
}
