"use client";

import { useState } from "react";
import type { RouteItem, Tour } from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabRoutesProps {
  homeItems: RouteItem[];
  tours: Tour[];
  onChangeHomeItems: (items: RouteItem[]) => void;
  onChangeTours: (tours: Tour[]) => void;
}

export function TabRoutes({
  homeItems,
  tours,
  onChangeHomeItems,
  onChangeTours
}: TabRoutesProps) {
  const [subTab, setSubTab] = useState<"home" | "tours">("home");
  const [selectedHomeIndex, setSelectedHomeIndex] = useState(0);
  const [selectedTourIndex, setSelectedTourIndex] = useState(0);

  const currentHomeItem = homeItems[selectedHomeIndex] || homeItems[0];
  const currentTour = tours[selectedTourIndex] || tours[0];

  // Ações Roteiros Home
  const handleUpdateHomeItem = (field: keyof RouteItem, value: string) => {
    const updated = [...homeItems];
    updated[selectedHomeIndex] = {
      ...updated[selectedHomeIndex],
      [field]: value
    };
    onChangeHomeItems(updated);
  };

  const handleAddHomeItem = () => {
    const newItem: RouteItem = {
      id: `route-${Date.now()}`,
      title: "Novo Roteiro Costeiro",
      description: "Paradas para banho, contemplação e águas transparentes.",
      image: "/images/ref-route-farol.svg",
      link: "/passeios"
    };
    const nextList = [...homeItems, newItem];
    onChangeHomeItems(nextList);
    setSelectedHomeIndex(nextList.length - 1);
  };

  const handleDeleteHomeItem = (idx: number) => {
    if (homeItems.length <= 1) {
      alert("Mantenha pelo menos um roteiro na lista da home.");
      return;
    }
    if (confirm("Remover este roteiro da Home?")) {
      const nextList = homeItems.filter((_, i) => i !== idx);
      onChangeHomeItems(nextList);
      setSelectedHomeIndex(Math.max(0, idx - 1));
    }
  };

  // Ações Catálogo de Passeios
  const handleUpdateTour = (field: keyof Tour, value: string) => {
    const updated = [...tours];
    updated[selectedTourIndex] = {
      ...updated[selectedTourIndex],
      [field]: value
    };
    onChangeTours(updated);
  };

  const handleAddTour = () => {
    const slug = `novo-passeio-${Date.now()}`;
    const newTour: Tour = {
      slug,
      name: "Novo Roteiro de Lancha",
      summary: "Passeio privativo pelas águas límpidas da Baía com atendimento exclusivo."
    };
    const nextList = [...tours, newTour];
    onChangeTours(nextList);
    setSelectedTourIndex(nextList.length - 1);
  };

  const handleDeleteTour = (idx: number) => {
    if (tours.length <= 1) {
      alert("Mantenha pelo menos um passeio cadastrado.");
      return;
    }
    if (confirm("Deseja realmente excluir este passeio do catálogo?")) {
      const nextList = tours.filter((_, i) => i !== idx);
      onChangeTours(nextList);
      setSelectedTourIndex(Math.max(0, idx - 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Seção de Roteiros & Passeios
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie os cards interativos da Home e a página oficial de passeios (/passeios).
          </p>
        </div>

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
            🏠 Destaques da Home ({homeItems.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("tours")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "tours"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            ⛵ Catálogo Completo /passeios ({tours.length})
          </button>
        </div>
      </div>

      {/* SUB-ABA 1: ROTEIROS DA HOME COM HOVER */}
      {subTab === "home" && (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Itens na Home ({homeItems.length})
              </span>
              <button
                type="button"
                onClick={handleAddHomeItem}
                className="text-xs text-brand-sea hover:underline font-bold"
              >
                + Adicionar
              </button>
            </div>

            <div className="space-y-2">
              {homeItems.map((item, idx) => {
                const isSelected = idx === selectedHomeIndex;
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setSelectedHomeIndex(idx)}
                    className={[
                      "flex items-center justify-between gap-2 p-3 rounded-2xl border transition cursor-pointer",
                      isSelected
                        ? "bg-cyan-50/80 border-cyan-400 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHomeItem(idx);
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

          {currentHomeItem && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Editando Roteiro da Home #{selectedHomeIndex + 1}
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Título do Roteiro
                </label>
                <input
                  type="text"
                  value={currentHomeItem.title}
                  onChange={(e) => handleUpdateHomeItem("title", e.target.value)}
                  placeholder="Ex: Ilha do Farol"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={currentHomeItem.description}
                  onChange={(e) =>
                    handleUpdateHomeItem("description", e.target.value)
                  }
                  placeholder="Ex: Paradas para banho, areia clara e travessia curta."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Foto de Visualização ao Passar o Mouse"
                value={currentHomeItem.image}
                onChange={(url) => handleUpdateHomeItem("image", url)}
                helperText="Esta imagem é exibida no card flutuante quando o visitante posiciona o mouse sobre o roteiro."
                previewHeightClass="h-44"
              />
            </div>
          )}
        </div>
      )}

      {/* SUB-ABA 2: CATÁLOGO GERAL DE PASSEIOS */}
      {subTab === "tours" && (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Passeios ({tours.length})
              </span>
              <button
                type="button"
                onClick={handleAddTour}
                className="text-xs text-brand-sea hover:underline font-bold"
              >
                + Novo Passeio
              </button>
            </div>

            <div className="space-y-2">
              {tours.map((tour, idx) => {
                const isSelected = idx === selectedTourIndex;
                return (
                  <div
                    key={tour.slug || idx}
                    onClick={() => setSelectedTourIndex(idx)}
                    className={[
                      "flex items-center justify-between gap-2 p-3 rounded-2xl border transition cursor-pointer",
                      isSelected
                        ? "bg-cyan-50/80 border-cyan-400 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {tour.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        /{tour.slug}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTour(idx);
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

          {currentTour && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Editando: {currentTour.name}
                  </h3>
                  <a
                    href={`/passeios/${currentTour.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-sea hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>Ver página individual do roteiro</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Nome do Roteiro
                </label>
                <input
                  type="text"
                  value={currentTour.name}
                  onChange={(e) => handleUpdateTour("name", e.target.value)}
                  placeholder="Ex: Ilha dos Frades & Guadalupe"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  URL Amigável (Slug)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">/passeios/</span>
                  <input
                    type="text"
                    value={currentTour.slug}
                    onChange={(e) =>
                      handleUpdateTour(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_-]/g, "-")
                      )
                    }
                    placeholder="ilha-dos-frades-guadalupe"
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Resumo / Apresentação do Passeio
                </label>
                <textarea
                  rows={4}
                  value={currentTour.summary}
                  onChange={(e) => handleUpdateTour("summary", e.target.value)}
                  placeholder="Águas cristalinas, praias preservadas com Bandeira Azul e gastronomia baiana à beira-mar."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
