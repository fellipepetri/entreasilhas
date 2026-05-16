import { SectionShell } from "@/components/section-shell";

export default function ContatoPage() {
  return (
    <SectionShell
      eyebrow="Contato"
      title="Canal de atendimento"
      description="Página reservada para formulário, WhatsApp, e-mail e demais pontos de contato."
    >
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6">
        <p className="text-sm leading-7 text-slate-600">
          Base pronta para integrar canais de atendimento e automações futuras.
        </p>
      </div>
    </SectionShell>
  );
}
