import { redirect } from "next/navigation";
import { SectionShell } from "@/components/section-shell";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function SobrePage() {
  const content = await getSiteContent().catch(() => null);
  if (content?.settings?.features?.about === false) {
    redirect("/");
  }

  const about = content?.about;
  const cards = about?.cards && about.cards.length > 0 ? about.cards : [
    {
      id: "card-1",
      icon: "🚤",
      title: "Embarcações Exclusivas",
      description:
        "Lanchas modernas equipadas com churrasqueira, som bluetooth, cabine e marinheiros credenciados pela Capitania dos Portos."
    },
    {
      id: "card-2",
      icon: "🌴",
      title: "Roteiros Sob Medida",
      description:
        "Passeios personalizados por Ilha dos Frades, Bom Jesus dos Passos, Ilha de Maré e enseadas de águas calmas e cristalinas."
    },
    {
      id: "card-3",
      icon: "⚓",
      title: "Hospitalidade Baiana",
      description:
        "Atendimento humanizado do planejamento ao desembarque, conectando nossos clientes às melhores mariscadas e tradições locais."
    }
  ];

  const whatsappNumber = content?.settings?.whatsappNumber || "5571992517302";

  return (
    <SectionShell
      eyebrow={about?.pageEyebrow || "Sobre a Entre as Ilhas"}
      title={about?.pageTitle || "Navegando pelos paraísos da Bahia"}
      description={
        about?.pageDescription ||
        "Conheça nossa proposta de turismo náutico exclusivo na Baía de Todos-os-Santos com conforto, segurança e roteiros personalizados."
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, idx) => (
          <div
            key={card.id || idx}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft"
          >
            <span className="text-3xl block mb-3">{card.icon}</span>
            <h3 className="text-lg font-bold text-brand-deep">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-gradient-to-r from-brand-deep to-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h4 className="text-xl font-bold text-white">
            {about?.ctaTitle || "Quer planejar um dia no mar?"}
          </h4>
          <p className="text-sm text-slate-300 mt-1">
            {about?.ctaDescription ||
              "Fale conosco diretamente pelo WhatsApp e monte o roteiro perfeito para a sua família ou grupo de amigos."}
          </p>
        </div>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold px-7 py-3.5 text-sm transition shadow-lg hover:scale-105"
        >
          <span>{about?.ctaButtonText || "Falar com a Equipe"}</span>
          <span>💬</span>
        </a>
      </div>
    </SectionShell>
  );
}
