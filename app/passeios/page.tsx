import Link from "next/link";
import { SectionShell } from "@/components/section-shell";
import { getSiteContent } from "@/lib/content-store";
import { tours as defaultTours } from "@/data/tours";

export default async function PasseiosPage() {
  const content = await getSiteContent().catch(() => null);
  const tours = content?.routes?.tours || defaultTours;

  return (
    <SectionShell
      eyebrow="Experiências Náuticas"
      title="Roteiros de Lancha & Passeios"
      description="Descubra nossos passeios privativos e programados pela Baía de Todos-os-Santos. Embarcações seguras com marinheiro e estrutura completa."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {tours.map((tour) => (
          <Link
            key={tour.slug}
            href={`/passeios/${tour.slug}`}
            className="group rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-50 text-brand-sea border border-cyan-200/60">
                  Roteiro Privativo
                </span>
                <span className="text-slate-400 group-hover:text-brand-sea group-hover:translate-x-0.5 transition font-bold">
                  ↗
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-deep group-hover:text-brand-sea transition">
                {tour.name}
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                {tour.summary}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-brand-sea">
              <span>Ver detalhes do roteiro</span>
              <span>Saiba mais →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-gradient-to-r from-brand-deep to-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold text-white">Deseja um roteiro sob medida?</h3>
          <p className="text-sm text-slate-300 mt-1">
            Personalizamos saídas para aniversários, ensaios fotográficos e passeios em família.
          </p>
        </div>
        <a
          href="https://wa.me/5571992517102?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20personalizado%20para%20passeio%20de%20lancha."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold px-7 py-3.5 text-sm transition shadow-lg hover:scale-105"
        >
          <span>Solicitar no WhatsApp</span>
          <span>💬</span>
        </a>
      </div>
    </SectionShell>
  );
}
