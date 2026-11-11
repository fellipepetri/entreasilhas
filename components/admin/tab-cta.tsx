"use client";

import type { CtaSectionData } from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabCtaProps {
  data: CtaSectionData;
  onChange: (data: CtaSectionData) => void;
  isEnabled?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
}

export function TabCta({
  data,
  onChange,
  isEnabled,
  onToggleEnabled
}: TabCtaProps) {
  const handleUpdate = (field: keyof CtaSectionData, value: unknown) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Banner de Ativação / Desativação da Funcionalidade */}
      {onToggleEnabled && (
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
            isEnabled !== false
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-slate-200 bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📣</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Status da Chamada Final no Site:{" "}
                <strong
                  className={
                    isEnabled !== false ? "text-emerald-700" : "text-slate-600"
                  }
                >
                  {isEnabled !== false
                    ? "ATIVADO (Visível na página inicial)"
                    : "DESATIVADO (Oculto no site)"}
                </strong>
              </p>
              <p className="text-[11px] text-slate-500">
                {isEnabled !== false
                  ? "A seção de fechamento e chamada para ação com o barco flutuante está ativa para todos os visitantes."
                  : "A seção está oculta no site para o público."}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled !== false}
            onClick={() => onToggleEnabled(!isEnabled)}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center ${
              isEnabled !== false
                ? "bg-emerald-500 ring-2 ring-emerald-300"
                : "bg-slate-300"
            }`}
            title={
              isEnabled !== false
                ? "Clique para desativar a Chamada Final"
                : "Clique para ativar a Chamada Final"
            }
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
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Chamada Final (CTA) & Efeitos Náuticos
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure a chamada de fechamento da Home com o título animado &ldquo;Venha viver Entre as Ilhas!&rdquo; e o barco flutuante com ondas.
        </p>
      </div>

      {/* Pré-visualização da Chamada */}
      <div className="rounded-3xl bg-brand-deep text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800">
        {/* Fundo da Prévia */}
        <div className="absolute inset-0">
          {data.mediaType === "video" && data.backgroundVideo ? (
            <video
              src={data.backgroundVideo}
              poster={data.backgroundImage}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (data.mediaType === "image" || !data.mediaType) && data.backgroundImage ? (
            <img
              src={data.backgroundImage}
              alt={data.title || "Fundo"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[linear-gradient(180deg,rgba(11,34,68,0.92),rgba(9,57,104,0.85)),url('/images/routes-bg.svg')] bg-cover bg-center" />
          )}
        </div>

        {/* Filtro degradê suave: azul escuro no topo até transparente na base */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,23,44,0.85)_0%,rgba(10,35,68,0.50)_40%,rgba(10,35,68,0.12)_70%,transparent_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,23,44,0.40)_0%,transparent_75%)]"
        />

        <div className="relative z-10 max-w-xl mx-auto space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {data.eyebrow || "Venha viver"}
          </p>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {data.title || "Entre as Ilhas!"}
          </h3>
          {data.subtitle && (
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto pt-1">
              {data.subtitle}
            </p>
          )}
          {data.buttonText && (
            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-lg">
                <span>{data.buttonText}</span>
                <span>⛵</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mídia de Fundo da Chamada Final */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Mídia de Fundo da Chamada Final
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Escolha uma foto ou vídeo para o fundo da seção. O filtro com degradê (azul escuro no topo até transparência na base) será aplicado automaticamente na frente da mídia para realçar os títulos e manter as cores originais da cena.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Tipo de Fundo
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            <button
              type="button"
              onClick={() => handleUpdate("mediaType", "none")}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                data.mediaType === "none"
                  ? "border-brand-deep bg-brand-deep text-white shadow-sm"
                  : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <span>🌊</span>
              <span>Padrão Náutico</span>
            </button>
            <button
              type="button"
              onClick={() => handleUpdate("mediaType", "image")}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                data.mediaType === "image" || !data.mediaType
                  ? "border-brand-deep bg-brand-deep text-white shadow-sm"
                  : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <span>📷</span>
              <span>Foto / Imagem</span>
            </button>
            <button
              type="button"
              onClick={() => handleUpdate("mediaType", "video")}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                data.mediaType === "video"
                  ? "border-brand-deep bg-brand-deep text-white shadow-sm"
                  : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <span>🎥</span>
              <span>Vídeo</span>
            </button>
          </div>
        </div>

        {data.mediaType === "video" ? (
          <div className="space-y-4">
            <ImageUploader
              label="Arquivo de Vídeo (MP4, WebM ou link)"
              value={data.backgroundVideo || ""}
              onChange={(url) => handleUpdate("backgroundVideo", url)}
              placeholder="/uploads/video-cta.mp4 ou https://..."
              helperText="Envie um vídeo em MP4 ou WebM (até 100MB) para reproduzir em loop contínuo no fundo da chamada."
              previewHeightClass="h-56"
              acceptVideo
            />
            <ImageUploader
              label="Foto de Capa / Poster do Vídeo (Opcional)"
              value={data.backgroundImage || ""}
              onChange={(url) => handleUpdate("backgroundImage", url)}
              placeholder="/images/routes-bg.svg ou foto enviada"
              helperText="Exibida enquanto o vídeo carrega no navegador."
              previewHeightClass="h-32"
            />
          </div>
        ) : data.mediaType === "image" || !data.mediaType ? (
          <ImageUploader
            label="Foto / Imagem de Fundo"
            value={data.backgroundImage || "/images/routes-bg.svg"}
            onChange={(url) => handleUpdate("backgroundImage", url)}
            placeholder="/images/routes-bg.svg ou foto enviada"
            helperText="Recomendado: foto em alta resolução com paisagem tropical (1920x1080)."
            previewHeightClass="h-48"
            acceptVideo
          />
        ) : null}
      </div>

      {/* Campos de Edição */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Textos da Chamada
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pré-Título (Linha de Destaque)
            </label>
            <input
              type="text"
              value={data.eyebrow}
              onChange={(e) => handleUpdate("eyebrow", e.target.value)}
              placeholder="Ex: Venha viver"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título Principal Grande
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleUpdate("title", e.target.value)}
              placeholder="Ex: Entre as Ilhas!"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtítulo Complementar
            </label>
            <input
              type="text"
              value={data.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
              placeholder="Ex: Passeios privativos pelas águas mais mornas e cristalinas da Baía de Todos-os-Santos."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Texto do Botão
            </label>
            <input
              type="text"
              value={data.buttonText || ""}
              onChange={(e) => handleUpdate("buttonText", e.target.value)}
              placeholder="Ex: Planejar Passeio"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link de Destino do Botão
            </label>
            <input
              type="text"
              value={data.buttonLink || ""}
              onChange={(e) => handleUpdate("buttonLink", e.target.value)}
              placeholder="Ex: #inicio ou https://wa.me/5571992517302"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Configuração da Transição Náutica (Barco e Ondas) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Transição Náutica (Barco Flutuando nas Ondas)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Animação entre a seção Sobre e a seção de Roteiros com ondas oceânicas interativas.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <span>Exibir Animação do Barco:</span>
            <input
              type="checkbox"
              checked={data.showBoatTransition !== false}
              onChange={(e) => handleUpdate("showBoatTransition", e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-4">
          <ImageUploader
            value={data.boatImage || "/images/barco.png"}
            onChange={(url) => handleUpdate("boatImage", url)}
            label="Imagem da Embarcação Flutuante"
            helperText="Foto em PNG transparente ou SVG exibida flutuando nas ondas."
            previewHeightClass="h-40"
          />
        </div>
      </div>
    </div>
  );
}
