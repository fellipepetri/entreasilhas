"use client";

import { useState } from "react";
import type {
  Experience360SectionData,
  PanoramaScene,
  PanoramaHotspot,
  HotspotType
} from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabExperience360Props {
  data: Experience360SectionData;
  onChange: (data: Experience360SectionData) => void;
}

export function TabExperience360({ data, onChange }: TabExperience360Props) {
  const [subTab, setSubTab] = useState<"scenes" | "header" | "secrets">("scenes");
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState<number | null>(null);

  const scenes = data.scenes || [];
  const currentScene = scenes[selectedSceneIndex] || scenes[0];

  const updateSectionField = (field: keyof Experience360SectionData, value: unknown) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleUpdateCurrentScene = (field: keyof PanoramaScene, value: unknown) => {
    const updatedScenes = [...scenes];
    updatedScenes[selectedSceneIndex] = {
      ...updatedScenes[selectedSceneIndex],
      [field]: value
    };
    onChange({ ...data, scenes: updatedScenes });
  };

  const handleAddScene = () => {
    const id = `cena-${Date.now()}`;
    const newScene: PanoramaScene = {
      id,
      title: "Nova Cena da Baía",
      subtitle: "Descrição e encantos deste ponto panorâmico",
      locationName: "Baía de Todos-os-Santos, BA",
      image: "/images/panoramas/ilha-dos-frades.jpg",
      previewThumb: "/images/panoramas/ilha-dos-frades.jpg",
      initialView: { pitch: 0, yaw: 0, fov: 75 },
      mapCoords: { x: 50, y: 50 },
      audioMood: "calm_waves",
      hotspots: []
    };
    const nextList = [...scenes, newScene];
    onChange({ ...data, scenes: nextList });
    setSelectedSceneIndex(nextList.length - 1);
    setSelectedHotspotIndex(null);
  };

  const handleDeleteScene = (idx: number) => {
    if (scenes.length <= 1) {
      alert("É necessário manter pelo menos uma cena na Experiência 360°.");
      return;
    }
    if (confirm("Deseja realmente excluir esta cena 360°?")) {
      const nextList = scenes.filter((_, i) => i !== idx);
      onChange({ ...data, scenes: nextList });
      setSelectedSceneIndex(Math.max(0, idx - 1));
      setSelectedHotspotIndex(null);
    }
  };

  // Hotspots
  const currentHotspots = currentScene?.hotspots || [];
  const currentHotspot =
    selectedHotspotIndex !== null ? currentHotspots[selectedHotspotIndex] : null;

  const handleAddHotspot = () => {
    if (!currentScene) return;
    const newHotspot: PanoramaHotspot = {
      id: `hotspot-${Date.now()}`,
      type: "info",
      pitch: 0,
      yaw: 0,
      title: "Novo Ponto de Interesse",
      shortDesc: "Breve resumo ao passar o mouse",
      infoContent: {
        title: "Título Detalhado",
        category: "Cultura & Paisagem",
        description: "Escreva aqui os detalhes, história ou dicas deste local."
      }
    };
    const updatedHotspots = [...currentHotspots, newHotspot];
    handleUpdateCurrentScene("hotspots", updatedHotspots);
    setSelectedHotspotIndex(updatedHotspots.length - 1);
  };

  const handleDeleteHotspot = (idx: number) => {
    if (confirm("Remover este ponto interativo?")) {
      const updatedHotspots = currentHotspots.filter((_, i) => i !== idx);
      handleUpdateCurrentScene("hotspots", updatedHotspots);
      setSelectedHotspotIndex(null);
    }
  };

  const handleUpdateCurrentHotspot = (
    field: keyof PanoramaHotspot,
    value: unknown
  ) => {
    if (selectedHotspotIndex === null || !currentHotspot) return;
    const updatedHotspots = [...currentHotspots];
    updatedHotspots[selectedHotspotIndex] = {
      ...updatedHotspots[selectedHotspotIndex],
      [field]: value
    };
    handleUpdateCurrentScene("hotspots", updatedHotspots);
  };

  return (
    <div className="space-y-6">
      {/* Topo com seletor de sub-abas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Experiência 360° Interativa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure cenas panorâmicas 360°, hotspots interativos, curiosidades culturais e roteiros.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab("scenes")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "scenes"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            🧭 Cenas & Hotspots ({scenes.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("header")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "header"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            ✏️ Textos da Seção
          </button>
          <button
            type="button"
            onClick={() => setSubTab("secrets")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "secrets"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            🐚 Tesouros Regionais ({data.secretsCatalog?.length || 0})
          </button>
        </div>
      </div>

      {/* SUB-ABA 1: Textos da Seção na Home */}
      {subTab === "header" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 max-w-3xl">
          <h3 className="text-base font-bold text-slate-900">
            Cabeçalho da Seção 360° na Página Inicial
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Etiqueta / Badge
              </label>
              <input
                type="text"
                value={data.badge}
                onChange={(e) => updateSectionField("badge", e.target.value)}
                placeholder="Entre as Ilhas 360º"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Destaque Colorido
              </label>
              <input
                type="text"
                value={data.highlight}
                onChange={(e) => updateSectionField("highlight", e.target.value)}
                placeholder="360°"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Título Principal
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateSectionField("title", e.target.value)}
              placeholder="ENTRE AS ILHAS"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Subtítulo
            </label>
            <input
              type="text"
              value={data.subtitle}
              onChange={(e) => updateSectionField("subtitle", e.target.value)}
              placeholder="Explore. Descubra. Viva a Baía antes mesmo de embarcar."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Texto Descritivo e Instruções
            </label>
            <textarea
              rows={4}
              value={data.description}
              onChange={(e) => updateSectionField("description", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
            />
          </div>
        </div>
      )}

      {/* SUB-ABA 2: Gerenciamento Completo de Cenas & Hotspots */}
      {subTab === "scenes" && (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Coluna Esquerda: Lista de Cenas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cenas 360° ({scenes.length})
              </span>
              <button
                type="button"
                onClick={handleAddScene}
                className="text-xs text-brand-sea hover:underline font-bold"
              >
                + Nova Cena
              </button>
            </div>

            <div className="space-y-2">
              {scenes.map((scene, idx) => {
                const isSelected = idx === selectedSceneIndex;
                return (
                  <div
                    key={scene.id}
                    onClick={() => {
                      setSelectedSceneIndex(idx);
                      setSelectedHotspotIndex(null);
                    }}
                    className={[
                      "flex items-center justify-between gap-2 p-3 rounded-2xl border transition text-left cursor-pointer",
                      isSelected
                        ? "bg-cyan-50/80 border-cyan-400 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {scene.title || `Cena ${idx + 1}`}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {scene.hotspots?.length || 0} pontos interativos
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScene(idx);
                      }}
                      className="p-1 text-rose-400 hover:text-rose-600 text-xs shrink-0"
                      title="Excluir cena"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna Direita: Dados da Cena Selecionada & Seus Hotspots */}
          {currentScene && (
            <div className="space-y-8">
              {/* Card 1: Configuração Básica da Cena */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Cena: {currentScene.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ID técnico: <code className="text-cyan-700 bg-cyan-50 px-1 py-0.5 rounded">{currentScene.id}</code>
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Título da Cena
                    </label>
                    <input
                      type="text"
                      value={currentScene.title}
                      onChange={(e) => handleUpdateCurrentScene("title", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Localização Geográfica
                    </label>
                    <input
                      type="text"
                      value={currentScene.locationName}
                      onChange={(e) => handleUpdateCurrentScene("locationName", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo / Descrição Rápida
                  </label>
                  <input
                    type="text"
                    value={currentScene.subtitle}
                    onChange={(e) => handleUpdateCurrentScene("subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                  />
                </div>

                {/* Imagem Panorâmica 360 */}
                <ImageUploader
                  label="Imagem Equirretangular 360°"
                  value={currentScene.image}
                  onChange={(url) => {
                    handleUpdateCurrentScene("image", url);
                    if (!currentScene.previewThumb) {
                      handleUpdateCurrentScene("previewThumb", url);
                    }
                  }}
                  helperText="Envie a foto equirretangular esférica 360 (formato 2:1, ex: 4096x2048 ou 6000x3000 em JPG/WebP)."
                  previewHeightClass="h-44"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Trilha Sonora / Som Ambiente
                    </label>
                    <select
                      value={currentScene.audioMood}
                      onChange={(e) => handleUpdateCurrentScene("audioMood", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                    >
                      <option value="calm_waves">Ondas Calmas (Enseada & Praia)</option>
                      <option value="harbor_breeze">Brisa do Cais & Gaivotas</option>
                      <option value="open_sea">Mar Aberto & Água Cristalina</option>
                      <option value="golden_sunset">Pôr do Sol & Marulho Dourado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Coordenadas no Radar Náutico (X % / Y %)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentScene.mapCoords.x}
                        onChange={(e) =>
                          handleUpdateCurrentScene("mapCoords", {
                            ...currentScene.mapCoords,
                            x: Number(e.target.value)
                          })
                        }
                        placeholder="X"
                        className="w-1/2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentScene.mapCoords.y}
                        onChange={(e) =>
                          handleUpdateCurrentScene("mapCoords", {
                            ...currentScene.mapCoords,
                            y: Number(e.target.value)
                          })
                        }
                        placeholder="Y"
                        className="w-1/2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Hotspots (Pontos Interativos da Cena) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Pontos Interativos (Hotspots) nesta Cena
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ícones flutuantes que o usuário pode clicar dentro da visão 360°.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHotspot}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition"
                  >
                    <span>+ Adicionar Hotspot</span>
                  </button>
                </div>

                {/* Lista de Hotspots */}
                {currentHotspots.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Nenhum ponto interativo cadastrado nesta cena. Clique em &quot;+ Adicionar Hotspot&quot;.
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentHotspots.map((hotspot, hIdx) => {
                      const isSelected = selectedHotspotIndex === hIdx;
                      const typeIcons: Record<HotspotType, string> = {
                        navigation: "🧭 Navegação",
                        info: "📍 Info Cultural",
                        tour: "🚤 Passeio de Lancha",
                        secret: "🐚 Tesouro Regional"
                      };
                      return (
                        <div
                          key={hotspot.id || hIdx}
                          onClick={() => setSelectedHotspotIndex(hIdx)}
                          className={[
                            "p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2",
                            isSelected
                              ? "bg-amber-50/70 border-amber-400 shadow-sm"
                              : "bg-slate-50 border-slate-200 hover:border-slate-300"
                          ].join(" ")}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-md inline-block mb-1">
                              {typeIcons[hotspot.type] || hotspot.type}
                            </span>
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {hotspot.title}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Pitch: {hotspot.pitch}° | Yaw: {hotspot.yaw}°
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHotspot(hIdx);
                            }}
                            className="p-1 text-rose-400 hover:text-rose-600 text-xs shrink-0"
                            title="Remover ponto"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Detalhes do Hotspot Selecionado */}
                {currentHotspot && selectedHotspotIndex !== null && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 mt-4">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200/80 pb-2">
                      Editar Hotspot: {currentHotspot.title}
                    </h4>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Tipo de Hotspot
                        </label>
                        <select
                          value={currentHotspot.type}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("type", e.target.value as HotspotType)
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                        >
                          <option value="info">📍 Informação Cultural & Curiosidade</option>
                          <option value="navigation">🧭 Navegação (Ir para outra cena)</option>
                          <option value="tour">🚤 Passeio de Lancha & Reserva</option>
                          <option value="secret">🐚 Tesouro Regional / Fauna & Flora</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Pitch Vertical (-90° a +90°)
                        </label>
                        <input
                          type="number"
                          min="-90"
                          max="90"
                          value={currentHotspot.pitch}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("pitch", Number(e.target.value))
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Yaw Horizontal (-180° a +180°)
                        </label>
                        <input
                          type="number"
                          min="-180"
                          max="180"
                          value={currentHotspot.yaw}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("yaw", Number(e.target.value))
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Título
                        </label>
                        <input
                          type="text"
                          value={currentHotspot.title}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("title", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Descrição Curta (Tooltip)
                        </label>
                        <input
                          type="text"
                          value={currentHotspot.shortDesc}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("shortDesc", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    {/* SE FOR NAVEGAÇÃO: Escolher cena de destino */}
                    {currentHotspot.type === "navigation" && (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                          Cena de Destino ao Clicar
                        </label>
                        <select
                          value={currentHotspot.targetSceneId || ""}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("targetSceneId", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                        >
                          <option value="">Selecione uma cena...</option>
                          {scenes.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title} ({s.locationName})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* SE FOR INFO CULTURAL */}
                    {currentHotspot.type === "info" && (
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-800">
                          Conteúdo do Modal Informativo:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Categoria (ex: Patrimônio Histórico)"
                            value={currentHotspot.infoContent?.category || ""}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("infoContent", {
                                ...currentHotspot.infoContent,
                                category: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                          <input
                            type="text"
                            placeholder="Badge (ex: Vista Panorâmica)"
                            value={currentHotspot.infoContent?.badge || ""}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("infoContent", {
                                ...currentHotspot.infoContent,
                                badge: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                        </div>

                        <textarea
                          rows={3}
                          placeholder="Descrição histórica ou sobre o local..."
                          value={currentHotspot.infoContent?.description || ""}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("infoContent", {
                              ...currentHotspot.infoContent,
                              description: e.target.value
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                        />

                        <textarea
                          rows={2}
                          placeholder="Curiosidade marcante..."
                          value={currentHotspot.infoContent?.curiosity || ""}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("infoContent", {
                              ...currentHotspot.infoContent,
                              curiosity: e.target.value
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                        />
                      </div>
                    )}

                    {/* SE FOR PASSEIO / TOUR */}
                    {currentHotspot.type === "tour" && (
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-800">
                          Detalhes do Passeio de Lancha Vinculado:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Título do Passeio"
                            value={currentHotspot.tourContent?.tourTitle || ""}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("tourContent", {
                                ...currentHotspot.tourContent,
                                tourTitle: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                          <input
                            type="text"
                            placeholder="Duração (ex: 6 a 7 horas)"
                            value={currentHotspot.tourContent?.duration || ""}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("tourContent", {
                                ...currentHotspot.tourContent,
                                duration: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Tipo de Embarcação (ex: Lancha Confort)"
                            value={currentHotspot.tourContent?.boatType || ""}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("tourContent", {
                                ...currentHotspot.tourContent,
                                boatType: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                          <input
                            type="text"
                            placeholder="Capacidade (ex: Até 12 passageiros)"
                            value={currentHotspot.tourContent?.capacity || ""}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("tourContent", {
                                ...currentHotspot.tourContent,
                                capacity: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Mensagem padrão para o WhatsApp do cliente..."
                          value={currentHotspot.tourContent?.whatsappMessage || ""}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("tourContent", {
                              ...currentHotspot.tourContent,
                              whatsappMessage: e.target.value
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                        />
                      </div>
                    )}

                    {/* SE FOR SEGREDO REGIONAL */}
                    {currentHotspot.type === "secret" && (
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-800">
                          Tesouro Oculto / Concha / Espécie Marinha:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder="Nome (ex: Concha de Peguari)"
                            value={currentHotspot.secretContent?.name || ""}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("secretContent", {
                                ...currentHotspot.secretContent,
                                name: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                          <input
                            type="text"
                            placeholder="Ícone / Emoji (ex: 🐚)"
                            value={currentHotspot.secretContent?.icon || "🐚"}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("secretContent", {
                                ...currentHotspot.secretContent,
                                icon: e.target.value
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          />
                          <select
                            value={currentHotspot.secretContent?.rarity || "Comum"}
                            onChange={(e) =>
                              handleUpdateCurrentHotspot("secretContent", {
                                ...currentHotspot.secretContent,
                                rarity: e.target.value as "Comum" | "Raro" | "Lendário"
                              })
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                          >
                            <option value="Comum">Comum</option>
                            <option value="Raro">Raro</option>
                            <option value="Lendário">Lendário</option>
                          </select>
                        </div>

                        <textarea
                          rows={3}
                          placeholder="História e curiosidade sobre esta espécie..."
                          value={currentHotspot.secretContent?.story || ""}
                          onChange={(e) =>
                            handleUpdateCurrentHotspot("secretContent", {
                              ...currentHotspot.secretContent,
                              story: e.target.value
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-ABA 3: Catálogo Geral de Tesouros */}
      {subTab === "secrets" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Catálogo dos Tesouros Regionais
              </h3>
              <p className="text-xs text-slate-500">
                Espécies marinhas, conchas e tradições colecionáveis da Experiência 360°.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(data.secretsCatalog || []).map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => {
                      const updated = [...data.secretsCatalog];
                      updated[idx] = { ...updated[idx], icon: e.target.value };
                      onChange({ ...data, secretsCatalog: updated });
                    }}
                    className="w-12 h-12 text-center text-2xl rounded-xl border border-slate-300 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...data.secretsCatalog];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        onChange({ ...data, secretsCatalog: updated });
                      }}
                      className="w-full font-bold text-xs text-slate-900 rounded-lg border border-slate-300 bg-white px-2.5 py-1 mb-1"
                    />
                    <input
                      type="text"
                      value={item.scientificName}
                      onChange={(e) => {
                        const updated = [...data.secretsCatalog];
                        updated[idx] = { ...updated[idx], scientificName: e.target.value };
                        onChange({ ...data, secretsCatalog: updated });
                      }}
                      placeholder="Nome científico"
                      className="w-full italic text-[11px] text-slate-600 rounded-lg border border-slate-300 bg-white px-2.5 py-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={item.location}
                    placeholder="Localização"
                    onChange={(e) => {
                      const updated = [...data.secretsCatalog];
                      updated[idx] = { ...updated[idx], location: e.target.value };
                      onChange({ ...data, secretsCatalog: updated });
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-slate-700"
                  />
                  <input
                    type="text"
                    value={item.category}
                    placeholder="Categoria"
                    onChange={(e) => {
                      const updated = [...data.secretsCatalog];
                      updated[idx] = { ...updated[idx], category: e.target.value };
                      onChange({ ...data, secretsCatalog: updated });
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
