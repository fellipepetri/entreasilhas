import { SectionShell } from "@/components/section-shell";

export default function SobrePage() {
  return (
    <SectionShell
      eyebrow="Sobre"
      title="Agência em construção"
      description="Área institucional reservada para posicionamento, história, diferenciais e proposta da marca."
    >
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6">
        <p className="text-sm leading-7 text-slate-600">
          Estrutura inicial pronta. O conteúdo final pode ser adicionado depois sem reorganizar a base do projeto.
        </p>
      </div>
    </SectionShell>
  );
}
