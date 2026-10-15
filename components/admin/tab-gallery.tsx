"use client";

import { useState } from "react";
import type { GallerySectionData, ShowcaseCard } from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabGalleryProps {
  data: GallerySectionData;
  onChange: (data: GallerySectionData) => void;
}

export function TabGallery({ data, onChange }: TabGalleryProps) {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const cards = data.cards || [];
  const currentCard = cards[selectedCardIndex] || cards[0];

  const handleUpdateField = (field: keyof GallerySectionData, value: unknown) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleUpdateCard = (field: keyof ShowcaseCard, value: unknown) => {
    const updatedCards = [...cards];
    updatedCards[selectedCardIndex] = {
      ...updatedCards[selectedCardIndex],
      [field]: value
    };
    onChange({ ...data, cards: updatedCards });
  };

  const handleAddCard = () => {
    const newCard: ShowcaseCard = {
      id: `gallery-card-${Date.now()}`,
      title: "Novo Recanto Paradisíaco",
      image: "/images/showcase-1.svg",
      size: "medium"
    };
    const nextList = [...cards, newCard];
    onChange({ ...data, cards: nextList });
    setSelectedCardIndex(nextList.length - 1);
  };

  const handleDeleteCard = (idx: number) => {
    if (cards.length <= 4) {
      alert("A galeria precisa de no mínimo 4 fotos para manter a simetria da grade.");
      return;
    }
    if (confirm("Deseja realmente remover esta foto da galeria?")) {
      const nextList = cards.filter((_, i) => i !== idx);
      onChange({ ...data, cards: nextList });
      setSelectedCardIndex(Math.max(0, idx - 1));
    }
  };

  const handleMoveCard = (idx: number, direction: "up" | "down") => {
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= cards.length) return;
    const copy = [...cards];
    const temp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = temp;
    onChange({ ...data, cards: copy });
    setSelectedCardIndex(target);
  };

  return (
    <div className="space-y-8">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Galeria de Fotos (Adventure Showcase)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalize os títulos e as fotos de grande impacto visual com efeito parallax.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCard}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-deep hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold shadow transition self-start sm:self-auto"
        >
          <span>Adicionar Foto</span>
          <span>➕</span>
        </button>
      </div>

      {/* Configuração de Títulos da Seção */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Títulos da Seção Galeria
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Etiqueta Superior (Eyebrow)
            </label>
            <input
              type="text"
              value={data.eyebrow}
              onChange={(e) => handleUpdateField("eyebrow", e.target.value)}
              placeholder="Adventure Showcase"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Título da Galeria
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleUpdateField("title", e.target.value)}
              placeholder="Galeria com recortes grandes..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Editor de Fotos */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Lista Lateral de Fotos */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Fotos Cadastradas ({cards.length})
          </p>
          <div className="space-y-2">
            {cards.map((card, idx) => {
              const isSelected = idx === selectedCardIndex;
              return (
                <div
                  key={card.id || idx}
                  onClick={() => setSelectedCardIndex(idx)}
                  className={[
                    "flex items-center justify-between gap-2 p-3 rounded-2xl border transition cursor-pointer",
                    isSelected
                      ? "bg-cyan-50/80 border-cyan-400 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  ].join(" ")}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {card.title || `Foto ${idx + 1}`}
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Tamanho: {card.size}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCard(idx, "up")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === cards.length - 1}
                      onClick={() => handleMoveCard(idx, "down")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 text-xs"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(idx)}
                      className="p-1 text-rose-400 hover:text-rose-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulário da Foto Selecionada */}
        {currentCard && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Editando Foto #{selectedCardIndex + 1}
              </h3>
            </div>

            <ImageUploader
              label="Arquivo de Imagem da Foto"
              value={currentCard.image}
              onChange={(url) => handleUpdateCard("image", url)}
              placeholder="/images/showcase-1.svg ou foto enviada"
              helperText="Fotos verticais ou proporção aproximada 3:4 / 4:5 funcionam perfeitamente no efeito parallax."
              previewHeightClass="h-56"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Legenda / Título da Foto
                </label>
                <input
                  type="text"
                  value={currentCard.title}
                  onChange={(e) => handleUpdateCard("title", e.target.value)}
                  placeholder="Ex: Mares transparentes"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Tamanho / Proporção no Layout
                </label>
                <select
                  value={currentCard.size}
                  onChange={(e) =>
                    handleUpdateCard("size", e.target.value as ShowcaseCard["size"])
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-medium"
                >
                  <option value="small">Small (Compacto)</option>
                  <option value="medium">Medium (Médio)</option>
                  <option value="large">Large (Grande)</option>
                  <option value="wide">Wide (Largo / Destaque)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
