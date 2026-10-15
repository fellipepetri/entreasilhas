import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionShell } from "@/components/section-shell";
import { fetchTourBySlug } from "@/lib/get-tour-by-slug";

type PasseioSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PasseioSlugPage({
  params
}: PasseioSlugPageProps) {
  const { slug } = await params;
  const tour = await fetchTourBySlug(slug);


  if (!tour) {
    notFound();
  }

  const whatsappMsg = `Olá! Tenho interesse no roteiro "${tour.name}" da Entre as Ilhas. Poderiam me passar datas disponíveis e valores?`;
  const whatsappUrl = `https://wa.me/5571992517102?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <SectionShell
      eyebrow="Roteiro Náutico"
      title={tour.name}
      description={tour.summary}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
          <div>
            <h3 className="text-xl font-bold text-brand-deep">Sobre o Roteiro</h3>
            <p className="mt-2 text-base text-slate-600 leading-relaxed">
              Navegue com total tranquilidade a bordo de lanchas confortáveis pela Baía de Todos-os-Santos.
              Paradas estratégicas para banho de mar, contemplação da natureza e gastronomia local.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-sea mb-3">
              O que está incluso na lancha
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Marinheiro habilitado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Combustível do roteiro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Cooler térmico com gelo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Som Bluetooth de alta qualidade</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Churrasqueira a bordo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Colete salva-vidas homologados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Lateral de Reserva */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/40 p-6 sm:p-8 shadow-soft flex flex-col justify-between">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white">
              Reserva & Orçamento
            </span>
            <h3 className="text-2xl font-bold text-brand-deep mt-3">
              Pronto para navegar?
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Consulte datas disponíveis, valores para o seu grupo e tire todas as suas dúvidas diretamente pelo WhatsApp oficial.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 text-sm transition shadow-lg hover:scale-105"
            >
              <span>Reservar pelo WhatsApp</span>
              <span>💬</span>
            </a>

            <Link
              href="/passeios"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3 text-sm transition border border-slate-200"
            >
              <span>← Voltar aos passeios</span>
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
