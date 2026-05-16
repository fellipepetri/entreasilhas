import Link from "next/link";
import { SectionShell } from "@/components/section-shell";
import { tours } from "@/data/tours";

export default function PasseiosPage() {
  return (
    <SectionShell
      eyebrow="Passeios"
      title="Catálogo inicial"
      description="Página base para futura vitrine de experiências, roteiros e saídas da agência."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {tours.map((tour) => (
          <Link
            key={tour.slug}
            href={`/passeios/${tour.slug}`}
            className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft transition hover:-translate-y-0.5"
          >
            <h2 className="text-xl font-semibold">{tour.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{tour.summary}</p>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
