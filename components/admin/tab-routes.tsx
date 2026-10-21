"use client";

import { useState } from "react";
import type { RouteItem, Tour } from "@/lib/content-types";
import { BOOKING_ROUTES, type BookingRouteOption } from "@/data/booking";
import { TIDE_LEVELS, ALL_TIDE_KEYS, type TideLevelKey } from "@/lib/tide-engine";
import { ImageUploader } from "./image-uploader";

interface TabRoutesProps {
  homeItems: RouteItem[];
  tours: Tour[];
  bookingRoutes?: BookingRouteOption[];
  onChangeHomeItems: (items: RouteItem[]) => void;
  onChangeTours: (tours: Tour[]) => void;
  onChangeBookingRoutes?: (routes: BookingRouteOption[]) => void;
}

export function TabRoutes({
  homeItems,
  tours,
  bookingRoutes,
  onChangeHomeItems,
  onChangeTours,
  onChangeBookingRoutes
}: TabRoutesProps) {
  const [subTab, setSubTab] = useState<"booking" | "home" | "tours">("booking");
  const [selectedHomeIndex, setSelectedHomeIndex] = useState(0);
  const [selectedTourIndex, setSelectedTourIndex] = useState(0);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState(0);

  const activeBookingRoutes = bookingRoutes && bookingRoutes.length > 0 ? bookingRoutes : BOOKING_ROUTES;

  const currentHomeItem = homeItems[selectedHomeIndex] || homeItems[0];
  const currentTour = tours[selectedTourIndex] || tours[0];
  const currentBookingRoute = activeBookingRoutes[selectedBookingIndex] || activeBookingRoutes[0];

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

  // Ações Catálogo de Passeios (/passeios)
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

  // Ações Roteiros de Agendamento (com Marés)
  const handleUpdateBookingRoute = (field: keyof BookingRouteOption, value: unknown) => {
    if (!onChangeBookingRoutes) return;
    const updated = [...activeBookingRoutes];
    updated[selectedBookingIndex] = {
      ...updated[selectedBookingIndex],
      [field]: value
    };
    onChangeBookingRoutes(updated);
  };

  const handleToggleTide = (key: TideLevelKey) => {
    if (!onChangeBookingRoutes) return;
    const currentTides = currentBookingRoute.bestTides || [];
    let nextTides: TideLevelKey[];

    if (currentTides.includes(key)) {
      nextTides = currentTides.filter((k) => k !== key);
    } else {
      nextTides = [...currentTides, key];
    }

    // Atualiza label automaticamente
    const label =
      nextTides.length === 6
        ? "Todas as marés (adaptável pelo marinheiro)"
        : nextTides.map((k) => TIDE_LEVELS[k]?.shortLabel || k).join(" • ");

    const updated = [...activeBookingRoutes];
    updated[selectedBookingIndex] = {
      ...updated[selectedBookingIndex],
      bestTides: nextTides,
      bestTidesLabel: label || "Nenhuma maré selecionada"
    };
    onChangeBookingRoutes(updated);
  };

  const handleApplyTidePreset = (preset: "cheia" | "baixa" | "todas") => {
    if (!onChangeBookingRoutes) return;
    let nextTides: TideLevelKey[];
    let label: string;

    if (preset === "cheia") {
      nextTides = ["intermediaria_enchente", "cheia", "cheia_vazante"];
      label = "Intermediária/enchente • Cheia • Cheia/vazante";
    } else if (preset === "baixa") {
      nextTides = ["baixa", "baixa_enchente", "intermediaria_vazante"];
      label = "Baixa • Baixa/enchente • Intermediária/vazante";
    } else {
      nextTides = [...ALL_TIDE_KEYS];
      label = "Todas as marés (adaptável pelo marinheiro)";
    }

    const updated = [...activeBookingRoutes];
    updated[selectedBookingIndex] = {
      ...updated[selectedBookingIndex],
      bestTides: nextTides,
      bestTidesLabel: label
    };
    onChangeBookingRoutes(updated);
  };

  const handleUpdateStopsFromText = (rawText: string) => {
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    handleUpdateBookingRoute("stops", lines);
  };

  const handleAddBookingRoute = () => {
    if (!onChangeBookingRoutes) return;
    const id = `roteiro-${Date.now()}`;
    const newRoute: BookingRouteOption = {
      id,
      slug: id,
      name: `Roteiro ${activeBookingRoutes.length + 1} - Novo Destino`,
      tagline: "Enseadas calmas e praias paradisíacas",
      shortDescription: "Paradas exclusivas de banho de mar e paisagens preservadas.",
      detailedDescription:
        "Um roteiro especial navegando pelas águas calmas e cristalinas da Baía de Todos-os-Santos.",
      stops: [
        "Parada 1: Banho de mar calmo",
        "Parada 2: Almoço e praia",
        "Parada 3: Retorno panorâmico"
      ],
      itinerary: [
        "Saída de Madre de Deus",
        "Primeira parada para banho e mergulho",
        "Parada gastronômica",
        "Navegação contemplativa de retorno"
      ],
      highlights: [
        "Águas calmas e mornas",
        "Ideal para famílias e grupos",
        "Marinheiro credenciado a bordo"
      ],
      duration: "09:00h às 16:00h (7 horas)",
      recommendedFor: "Grupos e famílias buscando tranquilidade",
      image: "/images/panoramas/ilha-dos-frades.jpg",
      badge: "Novo Roteiro",
      bestTides: ["intermediaria_enchente", "cheia", "cheia_vazante"],
      bestTidesLabel: "Intermediária/enchente • Cheia • Cheia/vazante"
    };

    const nextList = [...activeBookingRoutes, newRoute];
    onChangeBookingRoutes(nextList);
    setSelectedBookingIndex(nextList.length - 1);
  };

  const handleDeleteBookingRoute = (idx: number) => {
    if (!onChangeBookingRoutes) return;
    if (activeBookingRoutes.length <= 1) {
      alert("Mantenha pelo menos um roteiro de agendamento cadastrado.");
      return;
    }
    if (confirm("Deseja realmente remover este roteiro da área de agendamento?")) {
      const nextList = activeBookingRoutes.filter((_, i) => i !== idx);
      onChangeBookingRoutes(nextList);
      setSelectedBookingIndex(Math.max(0, idx - 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Seção de Roteiros, Passeios & Marés
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie os roteiros sincronizados com a tábua de marés de Madre de Deus, cards da Home e o catálogo geral.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-semibold flex-wrap">
          <button
            type="button"
            onClick={() => setSubTab("booking")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "booking"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            🌊 Roteiros de Agendamento ({activeBookingRoutes.length})
          </button>
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
            ⛵ Catálogo /passeios ({tours.length})
          </button>
        </div>
      </div>

      {/* SUB-ABA 1: ROTEIROS DE AGENDAMENTO (SINCRONIZADOS COM A MARÉ) */}
      {subTab === "booking" && (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Roteiros de Agendamento ({activeBookingRoutes.length})
              </span>
              <button
                type="button"
                onClick={handleAddBookingRoute}
                className="text-xs text-brand-sea hover:underline font-bold cursor-pointer"
              >
                + Novo Roteiro
              </button>
            </div>

            <div className="space-y-2">
              {activeBookingRoutes.map((route, idx) => {
                const isSelected = idx === selectedBookingIndex;
                return (
                  <div
                    key={route.id || idx}
                    onClick={() => setSelectedBookingIndex(idx)}
                    className={[
                      "flex items-center justify-between gap-2 p-3.5 rounded-2xl border transition cursor-pointer",
                      isSelected
                        ? "bg-cyan-50/80 border-cyan-400 shadow-sm ring-1 ring-cyan-400/40"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {route.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-cyan-800 font-medium truncate mt-0.5">
                        🌊 {route.bestTidesLabel}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBookingRoute(idx);
                      }}
                      className="p-1 text-rose-400 hover:text-rose-600 text-xs shrink-0 cursor-pointer"
                      title="Excluir este roteiro"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200/80 text-[11px] text-sky-900 leading-relaxed">
              💡 <strong>Sincronização com Marés:</strong> Estes roteiros aparecem no modal <em>"Planejar passeio"</em> e na página <em>/agendamento</em>. As condições da maré desabilitam/esmaecem automaticamente roteiros com paradas desfavoráveis na data selecionada.
            </div>
          </div>

          {/* Painel de Edição do Roteiro de Agendamento */}
          {currentBookingRoute && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/80 px-2.5 py-0.5 rounded-full">
                    Roteiro de Agendamento #{selectedBookingIndex + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {currentBookingRoute.name}
                  </h3>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Nome Completo do Roteiro
                  </label>
                  <input
                    type="text"
                    value={currentBookingRoute.name}
                    onChange={(e) => handleUpdateBookingRoute("name", e.target.value)}
                    placeholder="Ex: Roteiro 1 - Ilha dos Frades & Bom Jesus dos Passos"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Badge de Destaque
                  </label>
                  <input
                    type="text"
                    value={currentBookingRoute.badge || ""}
                    onChange={(e) => handleUpdateBookingRoute("badge", e.target.value)}
                    placeholder="Ex: Mais Procurado, Piscinas Naturais, 100% Flexível"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Subtítulo / Tagline
                </label>
                <input
                  type="text"
                  value={currentBookingRoute.tagline}
                  onChange={(e) => handleUpdateBookingRoute("tagline", e.target.value)}
                  placeholder="Ex: Praia do Loreto, Praia de Paramana, Praia do Marinheiro e Bom Jesus dos Passos"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              {/* Seção das Melhores Marés */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-deep flex items-center gap-1.5">
                      <span>🌊</span>
                      <span>Melhores Condições de Maré (Sincronização BTS)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Selecione quais níveis da maré tornam este roteiro favorável para visitação.
                    </p>
                  </div>

                  {/* Atalhos Rápidos */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleApplyTidePreset("cheia")}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-900 transition cursor-pointer"
                    >
                      Cheia / Enchente
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTidePreset("baixa")}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-100 hover:bg-teal-200 text-teal-900 transition cursor-pointer"
                    >
                      Baixa / Piscinas
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTidePreset("todas")}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition cursor-pointer"
                    >
                      Todas as Marés
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {ALL_TIDE_KEYS.map((key) => {
                    const tide = TIDE_LEVELS[key];
                    const isChecked = (currentBookingRoute.bestTides || []).includes(key);

                    return (
                      <label
                        key={key}
                        className={[
                          "flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer select-none",
                          isChecked
                            ? "bg-cyan-50/70 border-cyan-400 text-slate-900"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        ].join(" ")}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTide(key)}
                          className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold leading-tight flex items-center gap-1">
                            <span>{tide.icon}</span>
                            <span>{tide.name}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                            {tide.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Texto exibido aos clientes:</span>
                  <strong className="text-brand-deep">{currentBookingRoute.bestTidesLabel}</strong>
                </div>
              </div>

              {/* Paradas do Roteiro */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Paradas Principais (Uma por linha)
                </label>
                <textarea
                  rows={4}
                  value={(currentBookingRoute.stops || []).join("\n")}
                  onChange={(e) => handleUpdateStopsFromText(e.target.value)}
                  placeholder={`Ilha dos Frades: Praia do Loreto\nIlha dos Frades: Praia de Paramana\nIlha de Bom Jesus dos Passos`}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 font-mono leading-relaxed focus:border-brand-sea focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Digite cada parada em uma linha. Elas serão exibidas com marcadores (bullets) nos cards e no resumo do roteiro.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Descrição Curta (exibida nos cards)
                </label>
                <textarea
                  rows={2}
                  value={currentBookingRoute.shortDescription}
                  onChange={(e) => handleUpdateBookingRoute("shortDescription", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Descrição Detalhada da Experiência
                </label>
                <textarea
                  rows={4}
                  value={currentBookingRoute.detailedDescription}
                  onChange={(e) => handleUpdateBookingRoute("detailedDescription", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Foto de Capa do Roteiro"
                value={currentBookingRoute.image}
                onChange={(url) => handleUpdateBookingRoute("image", url)}
                helperText="Imagem panorâmica ilustrando as praias deste roteiro."
                previewHeightClass="h-48"
              />
            </div>
          )}
        </div>
      )}

      {/* SUB-ABA 2: ROTEIROS DA HOME COM HOVER */}
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

      {/* SUB-ABA 3: CATÁLOGO GERAL DE PASSEIOS */}
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
