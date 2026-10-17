import { useCallback, useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { SectionHead } from "@/components/sections/sections";
import pzuAsset from "@/assets/certificate-pzu.jpg.asset.json";
import tasAsset from "@/assets/certificate-tas.jpg.asset.json";
import usgAsset from "@/assets/certificate-usg.jpg.asset.json";

const certificates = [
  { src: pzuAsset.url, title: "Сертифікат ПЗУ України", company: "ПрАТ СК «ПЗУ України»", number: "СП №1057" },
  { src: tasAsset.url, title: "Сертифікат ТАС", company: "АТ «СК «ТАС»", number: "«Експерт страхового ринку»" },
  { src: usgAsset.url, title: "Сертифікат УСГ", company: "ПрАТ «СК «УСГ»", number: "USG-A 1904" },
];

export function CertificatesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close]);

  const open = openIndex !== null ? certificates[openIndex] : null;

  return (
    <section className="bg-secondary/50 py-20">
      <div className="container-page">
        <SectionHead
          eyebrow="Кваліфікація"
          title="Сертифікати страхових компаній"
          subtitle="Навчання підтверджено офіційними сертифікатами страхових компаній, з якими я працюю."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <button
              key={cert.title}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Відкрити ${cert.title}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-primary"
            >
              <img
                src={cert.src}
                alt={`${cert.title} — ${cert.company}, ${cert.number}`}
                width={1200}
                height={848}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover object-top"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all group-hover:bg-navy/50 group-hover:opacity-100">
                <ZoomIn className="size-8 text-white" />
              </span>
              <span className="block px-4 py-3">
                <span className="block font-bold leading-tight">{cert.company}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{cert.number}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={close}
          className="fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-navy/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Закрити сертифікат"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          <img
            src={open.src}
            alt={`${open.title} — ${open.company}`}
            width={1200}
            height={848}
            className="max-h-full max-w-full cursor-default rounded-xl bg-white shadow-lift"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
