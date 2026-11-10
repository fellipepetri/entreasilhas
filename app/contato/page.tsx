import { SectionShell } from "@/components/section-shell";
import { getSiteContent } from "@/lib/content-store";
import { defaultSiteContent } from "@/data/default-content";

export const dynamic = "force-dynamic";

export default async function ContatoPage() {
  const content = await getSiteContent().catch(() => defaultSiteContent);
  const contact = content.contact || defaultSiteContent.contact;

  return (
    <SectionShell
      eyebrow={contact.pageEyebrow || "Fale Conosco"}
      title={contact.pageTitle || "Canais de Atendimento"}
      description={
        contact.pageDescription ||
        "Entre em contato com a equipe Entre as Ilhas para tirar dúvidas, consultar disponibilidade de lanchas ou reservar o seu passeio."
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* WhatsApp */}
        <a
          href={
            contact.whatsappCard?.link ||
            "https://wa.me/5571992517302?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20passeios%20de%20lancha%20da%20Entre%20as%20Ilhas."
          }
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl border border-emerald-500/30 bg-emerald-50/50 p-6 sm:p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-105 transition">
            💬
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            {contact.whatsappCard?.badge || "Atendimento Rápido"}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {contact.whatsappCard?.title || "WhatsApp"}
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {contact.whatsappCard?.description ||
              "Converse diretamente com nossos consultores para orçamentos e reservas."}
          </p>
          <p className="mt-4 font-bold text-emerald-600 text-sm flex items-center gap-1 group-hover:underline">
            <span>{contact.whatsappCard?.value || "+55 (71) 99251-7302"}</span>
            <span>↗</span>
          </p>
        </a>

        {/* Instagram */}
        <a
          href={
            contact.instagramCard?.link ||
            "https://www.instagram.com/entreasilhas"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl border border-rose-500/30 bg-rose-50/50 p-6 sm:p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-105 transition">
            📸
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            {contact.instagramCard?.badge || "Rede Social Oficial"}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {contact.instagramCard?.title || "Instagram"}
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {contact.instagramCard?.description ||
              "Acompanhe stories diários, saídas de barco, marés e paisagens da Baía."}
          </p>
          <p className="mt-4 font-bold text-rose-600 text-sm flex items-center gap-1 group-hover:underline">
            <span>{contact.instagramCard?.value || "@entreasilhas"}</span>
            <span>↗</span>
          </p>
        </a>

        {/* Localização & Base */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-brand-sea text-white flex items-center justify-center text-2xl shadow-md mb-4">
            📍
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-sea">
            {contact.locationCard?.badge || "Base da Operação"}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {contact.locationCard?.title || "Baía de Todos-os-Santos"}
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {contact.locationCard?.description ||
              "Embarques programados nas principais marinas e pontos de apoio náutico de Salvador e região."}
          </p>
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {contact.locationCard?.note || "Atendimento mediante reserva prévia."}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
