"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabTestimonialsProps {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
  isEnabled?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
}

export function TabTestimonials({
  testimonials,
  onChange,
  isEnabled,
  onToggleEnabled
}: TabTestimonialsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentItem = testimonials[selectedIndex] || testimonials[0];

  const handleUpdate = (field: keyof Testimonial, value: unknown) => {
    const updated = [...testimonials];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      [field]: value
    };
    onChange(updated);
  };

  const handleAdd = () => {
    const newItem: Testimonial = {
      id: `testimonial-${Date.now()}`,
      name: "Novo Cliente Satisfeito",
      quote:
        "Experiência incrível e equipe super atenciosa! O passeio de lancha pelas ilhas foi o ponto alto da nossa viagem.",
      image: "/images/testimonials/rael-batista.jpg",
      rating: 5
    };
    const nextList = [...testimonials, newItem];
    onChange(nextList);
    setSelectedIndex(nextList.length - 1);
  };

  const handleDelete = (idx: number) => {
    if (testimonials.length <= 1) {
      alert("Mantenha pelo menos um depoimento cadastrado.");
      return;
    }
    if (confirm("Remover esta avaliação?")) {
      const nextList = testimonials.filter((_, i) => i !== idx);
      onChange(nextList);
      setSelectedIndex(Math.max(0, idx - 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Ativação / Desativação da Funcionalidade */}
      {onToggleEnabled && (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
          isEnabled !== false ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-slate-100"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">⭐</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Status das Avaliações no Site:{" "}
                <strong className={isEnabled !== false ? "text-emerald-700" : "text-slate-600"}>
                  {isEnabled !== false ? "ATIVADO (Visível na página e no menu)" : "DESATIVADO (Oculto no site)"}
                </strong>
              </p>
              <p className="text-[11px] text-slate-500">
                {isEnabled !== false
                  ? "O slide de depoimentos e notas dos clientes está sendo exibido na Home e no menu."
                  : "A seção de avaliações está oculta para o público e o item foi removido do menu de navegação."}
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
            title={isEnabled !== false ? "Desativar Avaliações" : "Ativar Avaliações"}
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
            Avaliações & Depoimentos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie os comentários dos clientes exibidos no carrossel de avaliações.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-deep hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold shadow transition self-start sm:self-auto"
        >
          <span>Adicionar Depoimento</span>
          <span>➕</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Lista Lateral de Depoimentos */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Depoimentos ({testimonials.length})
          </span>
          <div className="space-y-2">
            {testimonials.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={[
                    "flex items-center justify-between gap-2 p-3 rounded-2xl border transition cursor-pointer",
                    isSelected
                      ? "bg-cyan-50/80 border-cyan-400 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  ].join(" ")}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-amber-500 font-semibold mt-0.5">
                      {"★".repeat(item.rating || 5)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(idx);
                    }}
                    className="p-1 text-rose-400 hover:text-rose-600 text-xs shrink-0"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulário do Depoimento */}
        {currentItem && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Editando Avaliação: {currentItem.name}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Nome do Cliente / Viajante
                </label>
                <input
                  type="text"
                  value={currentItem.name}
                  onChange={(e) => handleUpdate("name", e.target.value)}
                  placeholder="Ex: Rael Batista"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Nota da Avaliação (Estrelas)
                </label>
                <select
                  value={currentItem.rating || 5}
                  onChange={(e) => handleUpdate("rating", Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold text-amber-500"
                >
                  <option value={5}>★★★★★ (5 Estrelas)</option>
                  <option value={4}>★★★★☆ (4 Estrelas)</option>
                  <option value={3}>★★★☆☆ (3 Estrelas)</option>
                </select>
              </div>
            </div>

            <ImageUploader
              label="Foto do Cliente / Avatar"
              value={currentItem.image}
              onChange={(url) => handleUpdate("image", url)}
              helperText="Foto quadrada do cliente para o cartão de depoimento."
              previewHeightClass="h-32 w-32"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Depoimento / Comentário
              </label>
              <textarea
                rows={4}
                value={currentItem.quote}
                onChange={(e) => handleUpdate("quote", e.target.value)}
                placeholder="Passeio muito bom, com atenção e cuidado e educação por parte da equipe."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
