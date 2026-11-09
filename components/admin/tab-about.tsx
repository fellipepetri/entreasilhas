"use client";

import type { AboutSectionData } from "@/lib/content-types";
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

      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Seção Sobre a Agência
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure a história, fotos de apresentação e métricas de destaque da empresa.
        </p>
      </div>

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
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
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
    </div>
  );
}
