"use client";

import type { FooterSectionData } from "@/lib/content-types";

interface TabFooterProps {
  data: FooterSectionData;
  onChange: (data: FooterSectionData) => void;
}

export function TabFooter({ data, onChange }: TabFooterProps) {
  const handleUpdate = (field: keyof FooterSectionData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Topo da Aba */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Rodapé Institucional do Site
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure as informações fixas no rodapé de todas as páginas: chamada &ldquo;Vamos navegar&rdquo;, informações de base, newsletter e copyright.
        </p>
      </div>

      {/* Pré-visualização do Rodapé */}
      <div className="rounded-3xl bg-brand-deep text-white p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/12 pb-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">{data.title || "Vamos navegar"}</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
              {data.description}
            </p>
          </div>
          <div className="text-sm sm:text-base font-bold text-cyan-300">
            {data.phoneFormatted} ↗
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-xs">
          <div>
            <p className="font-bold text-white mb-2">Links úteis</p>
            <p className="text-slate-400">Início • 360º • Passeios • Sobre • Contato</p>
          </div>
          <div>
            <p className="font-bold text-white mb-2">{data.baseTitle || "Base da operação"}</p>
            <p className="text-slate-300">{data.baseLocation}</p>
            <p className="text-slate-400 text-[11px] mt-0.5">{data.baseEmail}</p>
          </div>
          <div>
            <p className="font-bold text-white mb-2">{data.newsletterTitle || "Receber novidades"}</p>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
              <span className="text-slate-400 text-[11px] truncate">{data.newsletterPlaceholder}</span>
              <span className="ml-auto text-[10px] bg-cyan-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                {data.newsletterButton}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center text-[11px] uppercase tracking-widest text-slate-400">
          {data.copyright}
        </div>
      </div>

      {/* Seção 1: Chamada Superior do Rodapé */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Chamada &quot;Vamos navegar&quot; & Telefone
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Chamada
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleUpdate("title", e.target.value)}
              placeholder="Ex: Vamos navegar"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telefone Formatado em Destaque
            </label>
            <input
              type="text"
              value={data.phoneFormatted}
              onChange={(e) => handleUpdate("phoneFormatted", e.target.value)}
              placeholder="+55 (71) 99251-7302"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Texto Descritivo
            </label>
            <input
              type="text"
              value={data.description}
              onChange={(e) => handleUpdate("description", e.target.value)}
              placeholder="Ex: Experiências náuticas, águas mornas e os melhores roteiros de lancha..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link de Destino do Telefone (wa.me)
            </label>
            <input
              type="text"
              value={data.phoneLink}
              onChange={(e) => handleUpdate("phoneLink", e.target.value)}
              placeholder="https://wa.me/5571992517302"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Seção 2: Base da Operação */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Coluna da Base de Operação
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Coluna
            </label>
            <input
              type="text"
              value={data.baseTitle}
              onChange={(e) => handleUpdate("baseTitle", e.target.value)}
              placeholder="Ex: Base da operação"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Localização da Base
            </label>
            <input
              type="text"
              value={data.baseLocation}
              onChange={(e) => handleUpdate("baseLocation", e.target.value)}
              placeholder="Ex: Baía de Todos-os-Santos, Bahia"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Condição de Atendimento
            </label>
            <input
              type="text"
              value={data.baseSchedule}
              onChange={(e) => handleUpdate("baseSchedule", e.target.value)}
              placeholder="Ex: Atendimento por reserva e planejamento prévio"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail para Contato
            </label>
            <input
              type="email"
              value={data.baseEmail}
              onChange={(e) => handleUpdate("baseEmail", e.target.value)}
              placeholder="contato@entreasilhas.com.br"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Seção 3: Newsletter & Direitos Reservados */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Newsletter & Copyright
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Newsletter
            </label>
            <input
              type="text"
              value={data.newsletterTitle}
              onChange={(e) => handleUpdate("newsletterTitle", e.target.value)}
              placeholder="Ex: Receber novidades"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Texto Placeholder do Campo
            </label>
            <input
              type="text"
              value={data.newsletterPlaceholder}
              onChange={(e) => handleUpdate("newsletterPlaceholder", e.target.value)}
              placeholder="Ex: Seu melhor e-mail"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Texto do Botão
            </label>
            <input
              type="text"
              value={data.newsletterButton}
              onChange={(e) => handleUpdate("newsletterButton", e.target.value)}
              placeholder="Ex: Enviar"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Linha de Copyright & Direitos Reservados
            </label>
            <input
              type="text"
              value={data.copyright}
              onChange={(e) => handleUpdate("copyright", e.target.value)}
              placeholder="Ex: Entre as Ilhas • 2026 • Todos os direitos reservados"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
