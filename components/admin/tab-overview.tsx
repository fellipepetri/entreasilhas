"use client";

import type { SiteContent } from "@/lib/content-types";

interface TabOverviewProps {
  content: SiteContent;
  onNavigateTab: (tabId: string) => void;
}

export function TabOverview({ content, onNavigateTab }: TabOverviewProps) {
  const totalHotspots = content.experience360.scenes.reduce(
    (acc, scene) => acc + (scene.hotspots?.length || 0),
    0
  );

  const metrics = [
    {
      label: "Slides no Hero",
      count: content.heroSlides.length,
      icon: "🌅",
      tab: "hero",
      description: "Carrossel de abertura com fotos e números"
    },
    {
      label: "Cenas 360°",
      count: content.experience360.scenes.length,
      icon: "🌐",
      tab: "360",
      description: "Panoramas imersivos navegáveis da Baía"
    },
    {
      label: "Pontos Interativos 360°",
      count: totalHotspots,
      icon: "📍",
      tab: "360",
      description: "Curiosidades, lanchas e tesouros nas cenas"
    },
    {
      label: "Fotos na Galeria",
      count: content.gallery.cards.length,
      icon: "🖼️",
      tab: "gallery",
      description: "Cards com efeito visual parallax"
    },
    {
      label: "Roteiros & Passeios",
      count: content.routes.homeItems.length + content.routes.tours.length,
      icon: "⛵",
      tab: "routes",
      description: "Rotas da Home e catálogo /passeios"
    },
    {
      label: "Avaliações & Depoimentos",
      count: content.testimonials.length,
      icon: "⭐",
      tab: "testimonials",
      description: "Feedbacks com notas 5 estrelas de clientes"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Banner de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-deep via-slate-900 to-sky-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Central de Controle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bem-vindo ao Painel de Administração
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Aqui você pode editar e configurar em tempo real o conteúdo do site:
            panoramas e pontos da <strong>Experiência 360°</strong>, fotos da{" "}
            <strong>Galeria</strong>, slides da <strong>Hero</strong>, catálogo de{" "}
            <strong>Roteiros</strong>, depoimentos e muito mais.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md transition"
          >
            <span>Ver Site Aberto</span>
            <span>↗</span>
          </a>
          <a
            href="/agenda-painel"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md transition"
          >
            <span>Gerenciar Reservas & Agenda</span>
            <span>📅</span>
          </a>
          <button
            type="button"
            onClick={() => onNavigateTab("360")}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md transition"
          >
            <span>Configurar Experiência 360°</span>
            <span>🌐</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas do Conteúdo */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Resumo dos Conteúdos Atuais</span>
          <span className="text-xs font-normal text-slate-500">
            (Clique em qualquer cartão para editar)
          </span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigateTab(item.tab)}
              className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-brand-sea/50 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-3xl group-hover:scale-110 transition">
                  {item.icon}
                </span>
                <span className="text-3xl font-extrabold text-slate-900">
                  {item.count}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-sea transition">
                  {item.label}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-normal">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-brand-sea">
                <span>Editar conteúdo</span>
                <span className="group-hover:translate-x-1 transition">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dicas Rápidas de Operação */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span>💡 Como gerenciar as informações</span>
        </h4>
        <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">1.</span>
            <span>
              <strong>Salvamento Instantâneo:</strong> Após fazer qualquer alteração em um campo ou imagem, clique no botão flutuante <strong>&quot;Salvar Alterações&quot;</strong> no topo da tela para gravar no banco do site.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">2.</span>
            <span>
              <strong>Upload de Imagens:</strong> Em qualquer seção você pode enviar fotos do seu computador pelo botão <em>&quot;Subir Foto&quot;</em>. O sistema otimiza e salva automaticamente na pasta pública do site.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">3.</span>
            <span>
              <strong>Restauração & Backup:</strong> Na aba <em>Configurações</em> você pode baixar uma cópia completa de segurança em JSON ou restaurar os valores originais a qualquer momento.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
