"use client";

import { useState } from "react";
import type { HeroSlide } from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabHeroProps {
  slides: HeroSlide[];
  onChange: (slides: HeroSlide[]) => void;
}

export function TabHero({ slides, onChange }: TabHeroProps) {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const currentSlide = slides[selectedSlideIndex] || slides[0];

  const handleUpdateSlide = (field: keyof HeroSlide, value: string) => {
    const updated = [...slides];
    updated[selectedSlideIndex] = {
      ...updated[selectedSlideIndex],
      [field]: value
    };
    onChange(updated);
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-slide-${Date.now()}`,
      image: "/images/hero-banner.svg",
      alt: "Novo Slide de Paisagem Náutica",
      title: "Nova Paisagem e Roteiro Costeiro",
      stat: "100%",
      statLabel: "Experiência Personalizada",
      description:
        "Descreva aqui o visual do novo slide e a experiência de passeio para os visitantes."
    };
    const nextList = [...slides, newSlide];
    onChange(nextList);
    setSelectedSlideIndex(nextList.length - 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("É necessário manter pelo menos um slide no Hero.");
      return;
    }
    if (confirm("Tem certeza que deseja remover este slide?")) {
      const nextList = slides.filter((_, i) => i !== index);
      onChange(nextList);
      setSelectedSlideIndex(Math.max(0, index - 1));
    }
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const copy = [...slides];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
    setSelectedSlideIndex(targetIndex);
  };

  return (
    <div className="space-y-8">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Slide do Hero (Início do Site)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie as fotos, títulos em destaque, números e descrições do carrossel principal.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSlide}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-deep hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold shadow transition self-start sm:self-auto"
        >
          <span>Adicionar Novo Slide</span>
          <span>➕</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Lista Lateral de Slides */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Slides Cadastrados ({slides.length})
          </p>
          <div className="space-y-2">
            {slides.map((slide, idx) => {
              const isSelected = idx === selectedSlideIndex;
              return (
                <div
                  key={slide.id || idx}
                  className={[
                    "flex items-center justify-between gap-2 p-3 rounded-2xl border transition text-left cursor-pointer",
                    isSelected
                      ? "bg-cyan-50/80 border-cyan-400 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  ].join(" ")}
                  onClick={() => setSelectedSlideIndex(idx)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1.5">
                      <span>{slide.mediaType === "video" ? "🎥" : "📷"}</span>
                      <span className="truncate">{slide.title || `Slide ${idx + 1}`}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSlide(idx, "up")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 text-xs"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === slides.length - 1}
                      onClick={() => handleMoveSlide(idx, "down")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 text-xs"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(idx)}
                      className="p-1 text-rose-400 hover:text-rose-600 text-xs"
                      title="Excluir slide"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulário de Edição do Slide Selecionado */}
        {currentSlide && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                Editando Slide #{selectedSlideIndex + 1}
              </h3>
              <p className="text-xs text-slate-500">
                Preencha os campos abaixo. As alterações aparecerão imediatamente no site após salvar.
              </p>
            </div>

            {/* Tipo de Mídia: Foto ou Vídeo */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Tipo de Mídia de Fundo
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => handleUpdateSlide("mediaType", "image")}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (currentSlide.mediaType || "image") === "image"
                      ? "border-brand-deep bg-brand-deep text-white shadow-sm"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>📷</span>
                  <span>Foto / Imagem</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSlide("mediaType", "video")}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    currentSlide.mediaType === "video"
                      ? "border-brand-deep bg-brand-deep text-white shadow-sm"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>🎥</span>
                  <span>Vídeo</span>
                </button>
              </div>
            </div>

            {/* Mídia do Slide: Vídeo ou Imagem */}
            {currentSlide.mediaType === "video" ? (
              <div className="space-y-4">
                <ImageUploader
                  label="Arquivo de Vídeo (MP4, WebM ou link)"
                  value={currentSlide.video || ""}
                  onChange={(url) => handleUpdateSlide("video", url)}
                  onUploadComplete={(info) => {
                    handleUpdateSlide("video", info.url);
                    if (info.posterUrl) {
                      handleUpdateSlide("image", info.posterUrl);
                    }
                  }}
                  placeholder="/uploads/video.mp4 ou https://..."
                  helperText="Envie um vídeo em MP4 ou WebM (até 100MB) para reproduzir em loop silencioso no fundo do Hero."
                  previewHeightClass="h-56"
                  acceptVideo
                />
                <ImageUploader
                  label="Foto de Capa / Poster do Vídeo (Opcional)"
                  value={currentSlide.image}
                  onChange={(url) => handleUpdateSlide("image", url)}
                  placeholder="/images/hero-banner.svg ou foto enviada"
                  helperText="Exibida enquanto o vídeo carrega ou como fallback em conexões móveis lentas."
                  previewHeightClass="h-32"
                />
              </div>
            ) : (
              <ImageUploader
                label="Imagem de Fundo do Slide"
                value={currentSlide.image}
                onChange={(url) => handleUpdateSlide("image", url)}
                placeholder="/images/hero-banner.svg ou foto enviada"
                helperText="Recomendado: imagem panorâmica ou horizontal em alta resolução (1920x1080)."
                previewHeightClass="h-48"
                acceptVideo
              />
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Texto Alternativo da Imagem (Acessibilidade & SEO)
              </label>
              <input
                type="text"
                value={currentSlide.alt}
                onChange={(e) => handleUpdateSlide("alt", e.target.value)}
                placeholder="Ex: Vista costeira com mar aberto e ilhas ao fundo"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
              />
            </div>

            {/* Título Principal */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Título Principal em Destaque
              </label>
              <textarea
                rows={2}
                value={currentSlide.title}
                onChange={(e) => handleUpdateSlide("title", e.target.value)}
                placeholder="Ex: Vista costeira com mar aberto e ilhas ao fundo"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
              />
            </div>

            {/* Grid com Número e Rótulo de Destaque */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Número / Métrica de Destaque
                </label>
                <input
                  type="text"
                  value={currentSlide.stat}
                  onChange={(e) => handleUpdateSlide("stat", e.target.value)}
                  placeholder="Ex: 10+, 12+, 100%"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Rótulo da Métrica
                </label>
                <input
                  type="text"
                  value={currentSlide.statLabel}
                  onChange={(e) => handleUpdateSlide("statLabel", e.target.value)}
                  placeholder="Ex: Anos de operação turística"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Descrição do Slide
              </label>
              <textarea
                rows={3}
                value={currentSlide.description}
                onChange={(e) => handleUpdateSlide("description", e.target.value)}
                placeholder="Ex: Descubra águas transparentes, paisagens tropicais e travessias desenhadas para grupos..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
