"use client";

import { useState } from "react";
import type { AboutSectionData, AboutCard } from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabAboutProps {
  data: AboutSectionData;
  onChange: (data: AboutSectionData) => void;
  isEnabled?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
}

export function TabAbout({
  data,
  onChange,
  isEnabled,
  onToggleEnabled
}: TabAboutProps) {
  const [subTab, setSubTab] = useState<"home" | "page">("home");

  const handleUpdate = (field: keyof AboutSectionData, value: unknown) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleUpdateStat = (
    index: number,
    field: "value" | "label",
    val: string
  ) => {
    const updated = [...(data.stats || [])];
    updated[index] = { ...updated[index], [field]: val };
    handleUpdate("stats", updated);
  };

  const handleAddStat = () => {
    const nextStats = [...(data.stats || []), { value: "100%", label: "Novo Destaque" }];
    handleUpdate("stats", nextStats);
  };

  const handleDeleteStat = (index: number) => {
    const nextStats = (data.stats || []).filter((_, i) => i !== index);
    handleUpdate("stats", nextStats);
  };

  const handleUpdateCard = (
    index: number,
    field: keyof AboutCard,
    val: string
  ) => {
    const cards = [...(data.cards || [])];
    cards[index] = { ...cards[index], [field]: val };
    handleUpdate("cards", cards);
  };

  const handleAddCard = () => {
    const nextCards = [
      ...(data.cards || []),
      {
        id: `card-${Date.now()}`,
        icon: "✨",
        title: "Novo Diferencial",
        description: "Descreva este diferencial náutico ou serviço oferecido."
      }
    ];
    handleUpdate("cards", nextCards);
  };

  const handleDeleteCard = (index: number) => {
    if ((data.cards || []).length <= 1) {
      alert("Mantenha ao menos 1 cartão cadastrado.");
      return;
    }
    const nextCards = (data.cards || []).filter((_, i) => i !== index);
    handleUpdate("cards", nextCards);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Banner de Ativação / Desativação da Funcionalidade */}
      {onToggleEnabled && (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
          isEnabled !== false ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-slate-100"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Status da Seção Sobre no Site:{" "}
                <strong className={isEnabled !== false ? "text-emerald-700" : "text-slate-600"}>
                  {isEnabled !== false ? "ATIVADO (Visível na página e no menu)" : "DESATIVADO (Oculto no site)"}
                </strong>
              </p>
              <p className="text-[11px] text-slate-500">
                {isEnabled !== false
                  ? "A história, fotos e números da agência estão sendo exibidos na Home, no menu e na página /sobre."
                  : "A seção sobre está oculta para o público e o item foi removido do menu de navegação."}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled !== false}
            onClick={() => onToggleEnabled(isEnabled === false)}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center ${
              isEnabled !== false ? "bg-emerald-500 ring-2 ring-emerald-300" : "bg-slate-300"
            }`}
            title={isEnabled !== false ? "Desativar Seção Sobre" : "Ativar Seção Sobre"}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                isEnabled !== false ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Sobre a Agência
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure a história, fotos de apresentação, métricas e o conteúdo da página /sobre.
          </p>
        </div>

        {/* Sub-abas de navegação interna */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab("home")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "home"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            🏠 Seção da Home
          </button>
          <button
            type="button"
            onClick={() => setSubTab("page")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "page"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            📄 Página Completa (/sobre)
          </button>
        </div>
      </div>

      {/* SUB-ABA 1: SEÇÃO DA HOME */}
      {subTab === "home" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Etiqueta Superior (Eyebrow)
              </label>
              <input
                type="text"
                value={data.eyebrow}
                onChange={(e) => handleUpdate("eyebrow", e.target.value)}
                placeholder="Quem somos"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Título Principal
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleUpdate("title", e.target.value)}
                placeholder="Explorando a beleza entre ondas, ilhas e marés."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Primeiro Parágrafo (Destaque sob a foto principal)
            </label>
            <textarea
              rows={3}
              value={data.paragraph1}
              onChange={(e) => handleUpdate("paragraph1", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Segundo Parágrafo (Corpo explicativo)
            </label>
            <textarea
              rows={3}
              value={data.paragraph2}
              onChange={(e) => handleUpdate("paragraph2", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          {/* Métricas e Estatísticas */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Contadores e Estatísticas
              </label>
              <button
                type="button"
                onClick={handleAddStat}
                className="text-xs text-brand-sea hover:underline font-bold"
              >
                + Adicionar Contador
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(data.stats || []).map((stat, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Contador #{sIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteStat(sIdx)}
                      className="text-xs text-rose-500 hover:text-rose-700"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(sIdx, "value", e.target.value)}
                    placeholder="Ex: 10K, 12+"
                    className="font-bold text-base text-slate-900 rounded-lg border border-slate-300 bg-white px-2.5 py-1"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleUpdateStat(sIdx, "label", e.target.value)}
                    placeholder="Ex: viajantes atendidos"
                    className="text-xs text-slate-600 rounded-lg border border-slate-300 bg-white px-2.5 py-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Imagens da Seção Sobre */}
          <div className="border-t border-slate-100 pt-5 grid gap-6 sm:grid-cols-2">
            <ImageUploader
              label="Foto Principal com Borda Náutica"
              value={data.mainImage}
              onChange={(url) => handleUpdate("mainImage", url)}
              helperText="Exibida no cartão vertical à esquerda."
              previewHeightClass="h-44"
            />

            <ImageUploader
              label="Foto Secundária / Galeria Inferior"
              value={data.secondaryImage}
              onChange={(url) => handleUpdate("secondaryImage", url)}
              helperText="Exibida na horizontal à direita."
              previewHeightClass="h-44"
            />
          </div>
        </div>
      )}

      {/* SUB-ABA 2: PÁGINA COMPLETA /SOBRE */}
      {subTab === "page" && (
        <div className="space-y-6">
          {/* Cabeçalho da página /sobre */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Cabeçalho de Apresentação (/sobre)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eyebrow (Etiqueta Superior)
                </label>
                <input
                  type="text"
                  value={data.pageEyebrow || "Sobre a Entre as Ilhas"}
                  onChange={(e) => handleUpdate("pageEyebrow", e.target.value)}
                  placeholder="Ex: Sobre a Entre as Ilhas"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Principal da Página
                </label>
                <input
                  type="text"
                  value={data.pageTitle || "Navegando pelos paraísos da Bahia"}
                  onChange={(e) => handleUpdate("pageTitle", e.target.value)}
                  placeholder="Ex: Navegando pelos paraísos da Bahia"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição da Página
                </label>
                <textarea
                  rows={2}
                  value={data.pageDescription || ""}
                  onChange={(e) => handleUpdate("pageDescription", e.target.value)}
                  placeholder="Ex: Conheça nossa proposta de turismo náutico exclusivo..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Cartões de Diferenciais da Página /sobre */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cartões de Diferenciais & Proposta
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cards em grade exibidos no centro da página /sobre.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCard}
                className="text-xs font-bold text-brand-sea hover:underline"
              >
                + Adicionar Cartão
              </button>
            </div>

            <div className="space-y-4">
              {(data.cards || []).map((card, cIdx) => (
                <div
                  key={card.id || cIdx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Cartão #{cIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(cIdx)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                    >
                      Remover Cartão ✕
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Ícone (Emoji)
                      </label>
                      <input
                        type="text"
                        value={card.icon}
                        onChange={(e) => handleUpdateCard(cIdx, "icon", e.target.value)}
                        placeholder="Ex: 🚤, 🌴, ⚓"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-center text-slate-900 focus:border-brand-sea focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Título do Diferencial
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleUpdateCard(cIdx, "title", e.target.value)}
                        placeholder="Ex: Embarcações Exclusivas"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 focus:border-brand-sea focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Descrição Completa
                      </label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) =>
                          handleUpdateCard(cIdx, "description", e.target.value)
                        }
                        placeholder="Ex: Lanchas modernas equipadas com churrasqueira..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-sea focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner CTA Inferior da Página /sobre */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Banner de Fechamento & Contato (/sobre)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título do Banner
                </label>
                <input
                  type="text"
                  value={data.ctaTitle || "Quer planejar um dia no mar?"}
                  onChange={(e) => handleUpdate("ctaTitle", e.target.value)}
                  placeholder="Ex: Quer planejar um dia no mar?"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={data.ctaButtonText || "Falar com a Equipe"}
                  onChange={(e) => handleUpdate("ctaButtonText", e.target.value)}
                  placeholder="Ex: Falar com a Equipe"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto Explicativo
                </label>
                <input
                  type="text"
                  value={
                    data.ctaDescription ||
                    "Fale conosco diretamente pelo WhatsApp e monte o roteiro perfeito..."
                  }
                  onChange={(e) => handleUpdate("ctaDescription", e.target.value)}
                  placeholder="Ex: Fale conosco diretamente pelo WhatsApp..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

