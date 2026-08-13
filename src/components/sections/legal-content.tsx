import type { LegalBlock } from "@/content/legal";

export function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <section className="py-14">
      <div className="container-page max-w-3xl space-y-8">
        {blocks.map((block, i) => (
          <div key={i} className="space-y-3">
            {block.heading ? (
              <h2 className="text-xl font-bold text-foreground">{block.heading}</h2>
            ) : null}
            {block.paragraphs?.map((p, j) => (
              <p key={j} className="text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            {block.list ? (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {block.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
