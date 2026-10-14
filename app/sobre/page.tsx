import { SectionShell } from "@/components/section-shell";

export default function SobrePage() {
  return (
    <SectionShell
      eyebrow="Sobre a Entre as Ilhas"
      title="Navegando pelos paraísos da Bahia"
      description="Conheça nossa proposta de turismo náutico exclusivo na Baía de Todos-os-Santos com conforto, segurança e roteiros personalizados."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft">
          <span className="text-3xl block mb-3">🚤</span>
          <h3 className="text-lg font-bold text-brand-deep">Embarcações Exclusivas</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Lanchas modernas equipadas com churrasqueira, som bluetooth, cabine e marinheiros credenciados pela Capitania dos Portos.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft">
          <span className="text-3xl block mb-3">🌴</span>
          <h3 className="text-lg font-bold text-brand-deep">Roteiros Sob Medida</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Passeios personalizados por Ilha dos Frades, Bom Jesus dos Passos, Ilha de Maré e enseadas de águas calmas e cristalinas.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft">
          <span className="text-3xl block mb-3">⚓</span>
          <h3 className="text-lg font-bold text-brand-deep">Hospitalidade Baiana</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Atendimento humanizado do planejamento ao desembarque, conectando nossos clientes às melhores mariscadas e tradições locais.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-gradient-to-r from-brand-deep to-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h4 className="text-xl font-bold text-white">Quer planejar um dia no mar?</h4>
          <p className="text-sm text-slate-300 mt-1">
            Fale conosco diretamente pelo WhatsApp e monte o roteiro perfeito para a sua família ou grupo de amigos.
          </p>
        </div>
        <a
          href="https://wa.me/5571992517102"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold px-7 py-3.5 text-sm transition shadow-lg hover:scale-105"
        >
          <span>Falar com a Equipe</span>
          <span>💬</span>
        </a>
      </div>
    </SectionShell>
  );
}
