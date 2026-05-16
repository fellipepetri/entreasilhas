import { SectionShell } from "@/components/section-shell";

export default function HomePage() {
  return (
    <SectionShell
      eyebrow="Base inicial"
      title="Entre as Ilhas"
      description="Estrutura inicial pronta para evoluir o site e webApp da agência com organização, tipagem e rotas base."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-deep">Passeios</h2>
          <p className="mt-2 text-sm text-slate-600">
            Base preparada para listagem e páginas dinâmicas por slug.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-deep">Institucional</h2>
          <p className="mt-2 text-sm text-slate-600">
            Seção sobre a agência pronta para receber conteúdo editorial.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-deep">Contato</h2>
          <p className="mt-2 text-sm text-slate-600">
            Estrutura reservada para canais, formulário e atendimento.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
