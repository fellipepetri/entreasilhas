"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateTidesForDate,
  getBTSClimatology,
  getComprehensiveMarineReport,
  type ComprehensiveMarineReport
} from "@/lib/marine-weather";

interface PlanTourWeatherProps {
  selectedDate: Date;
  includeSunset?: boolean;
  className?: string;
}

export function PlanTourWeather({
  selectedDate,
  includeSunset = false,
  className
}: PlanTourWeatherProps) {
  // Cálculo astronômico imediato e determinístico via useMemo (zero lag / zero cascading renders)
  const baseReport = useMemo<ComprehensiveMarineReport>(() => {
    const tides = calculateTidesForDate(selectedDate);
    const clim = getBTSClimatology(selectedDate);
    return {
      dateISO: tides.dateISO,
      formattedDate: tides.formattedDate,
      weather: clim.weather,
      wind: clim.wind,
      tides
    };
  }, [selectedDate]);

  const [liveReport, setLiveReport] = useState<ComprehensiveMarineReport | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"todos" | "mares" | "vento">("todos");

  // Busca assíncrona da previsão ao vivo (quando disponível para a data)
  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(() => {
      if (!isCancelled) setIsLiveLoading(true);
    }, 0);

    getComprehensiveMarineReport(selectedDate)
      .then((res) => {
        if (!isCancelled) {
          setLiveReport(res);
        }
      })
      .catch(() => {
        // Mantém relatório astronômico base
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLiveLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedDate]);

  // Se o relatório ao vivo corresponder à data selecionada, utiliza-o; caso contrário, usa o cálculo base
  const report =
    liveReport && liveReport.dateISO === baseReport.dateISO ? liveReport : baseReport;

  const { weather, wind, tides } = report;
  const isSizigia = tides.moon.isSizigia;

  return (
    <section
      id="weather"
      aria-label="Informações meteorológicas, vento e tábua de marés da Baía de Todos-os-Santos"
      className={[
        "weather-section rounded-2xl sm:rounded-3xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/60 via-sky-50/30 to-blue-50/50 p-4 sm:p-5 text-slate-900 shadow-xs transition-all relative overflow-hidden",
        className
      ].filter(Boolean).join(" ")}
    >
      {/* Detalhe náutico sutil no fundo */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Cabeçalho do Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 pb-3 border-b border-cyan-200/60">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-brand-sea text-white flex items-center justify-center shrink-0 shadow-xs text-lg">
            🌊
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-100/90 border border-cyan-300/60 px-2 py-0.5 rounded-full">
                Previsão & Marés BTS
              </span>
              <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <span>📍</span>
                <span>Frades • Bom Jesus • Madre de Deus</span>
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-deep tracking-tight mt-0.5 capitalize">
              {tides.formattedDate}
            </h3>
          </div>
        </div>

        {/* Badges de Status / Ao vivo */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span
            className={[
              "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border",
              weather.source === "realtime"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            ].join(" ")}
            title={
              weather.source === "realtime"
                ? "Previsão meteorológica integrada via Open-Meteo"
                : "Climatologia náutica típica de alta precisão para a Baía"
            }
          >
            <span
              className={[
                "w-1.5 h-1.5 rounded-full",
                weather.source === "realtime" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
              ].join(" ")}
            />
            <span>{weather.source === "realtime" ? "Previsão Ao Vivo" : "Climatologia Náutica"}</span>
          </span>

          {isLiveLoading && (
            <span className="text-[10px] text-cyan-700 font-medium animate-pulse">
              Atualizando...
            </span>
          )}
        </div>
      </div>

      {/* Mini Abas para Alternar ou Focar */}
      <div className="flex items-center gap-1 p-1 bg-white/80 rounded-xl border border-slate-200/80 mb-3 text-xs font-bold text-slate-600 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("todos")}
          className={[
            "flex-1 py-1 px-2.5 rounded-lg text-center transition cursor-pointer text-[11px]",
            activeTab === "todos"
              ? "bg-brand-deep text-white shadow-xs"
              : "hover:bg-slate-100 hover:text-slate-900"
          ].join(" ")}
        >
          Visão Completa
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("mares")}
          className={[
            "flex-1 py-1 px-2.5 rounded-lg text-center transition cursor-pointer text-[11px] flex items-center justify-center gap-1",
            activeTab === "mares"
              ? "bg-brand-deep text-white shadow-xs"
              : "hover:bg-slate-100 hover:text-slate-900"
          ].join(" ")}
        >
          <span>🌊</span>
          <span>Tábua de Marés</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("vento")}
          className={[
            "flex-1 py-1 px-2.5 rounded-lg text-center transition cursor-pointer text-[11px] flex items-center justify-center gap-1",
            activeTab === "vento"
              ? "bg-brand-deep text-white shadow-xs"
              : "hover:bg-slate-100 hover:text-slate-900"
          ].join(" ")}
        >
          <span>💨</span>
          <span>Tempo & Vento</span>
        </button>
      </div>

      {/* CONTEÚDO PRINCIPAL: Módulos de Informações */}
      <div className="space-y-3">
        {/* CARDS RESUMO: CLIMA + VENTO (visíveis na aba 'todos' e 'vento') */}
        {(activeTab === "todos" || activeTab === "vento") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Card Previsão do Tempo */}
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>☀️</span> Previsão do Tempo
                </span>
                <span className="text-xl" title={weather.condition}>
                  {weather.conditionIcon}
                </span>
              </div>

              <div>
                <p className="font-extrabold text-sm text-slate-900 leading-snug">
                  {weather.condition}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-black text-brand-deep">
                    {weather.tempMax}°C
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Mín {weather.tempMin}°C
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1" title="Probabilidade de precipitação">
                  <span>💧</span> Chuva: <strong>{weather.rainProbability}%</strong>
                </span>
                <span className="flex items-center gap-1" title="Índice de radiação ultravioleta">
                  <span>🔆</span> UV: <strong className="text-amber-700">{weather.uvIndex} ({weather.uvLevel})</strong>
                </span>
              </div>
            </div>

            {/* 2. Card Condições do Vento */}
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>💨</span> Vento & Navegação
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {wind.nauticalRating}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-brand-deep">
                    {wind.speedKnots} nós
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    ({wind.speedKmh} km/h)
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                  <span className="inline-block transform rotate-45 text-cyan-600">🧭</span>
                  <span>{wind.directionCardinal} • {wind.directionDescription}</span>
                </p>
              </div>

              <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-600 truncate" title={wind.bayCondition}>
                <span>🌊 {wind.bayCondition}</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. TÁBUA DE MARÉS DA BAÍA DE TODOS-OS-SANTOS (visível na aba 'todos' e 'mares') */}
        {(activeTab === "todos" || activeTab === "mares") && (
          <div className="p-3.5 rounded-xl bg-white border border-cyan-200/90 shadow-2xs space-y-2.5">
            {/* Topo da Tábua: Fase da Lua & Tipo de Maré */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl" title={tides.moon.phaseName}>
                  {tides.moon.phaseIcon}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">
                      {tides.moon.phaseName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-md">
                      {tides.moon.illuminationPercent}% iluminada
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Idade da lua: {tides.moon.moonAgeDays} dias
                  </p>
                </div>
              </div>

              {/* Tag de Sizígia vs Quadratura */}
              <div className="sm:text-right">
                <span
                  className={[
                    "inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border",
                    isSizigia
                      ? "bg-amber-50 text-amber-900 border-amber-300"
                      : "bg-sky-50 text-sky-900 border-sky-300"
                  ].join(" ")}
                >
                  {isSizigia ? "⚡ Maré de Sizígia" : "⚖️ Maré de Quadratura"}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                  {tides.moon.tideRegimenDescription}
                </p>
              </div>
            </div>

            {/* Tabela dos 4 Eventos de Maré do Dia */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <span>📊</span> Horários & Alturas da Maré
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Referência: Nível de Redução (NR) BTS
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tides.events.map((evt, idx) => {
                  const isHigh = evt.kind === "high";
                  return (
                    <div
                      key={`${evt.timeFormatted}-${idx}`}
                      className={[
                        "p-2 rounded-lg border text-center transition flex flex-col justify-between",
                        isHigh
                          ? "bg-gradient-to-b from-sky-50 to-cyan-50/60 border-sky-200"
                          : "bg-gradient-to-b from-amber-50/60 to-orange-50/40 border-amber-200"
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <span className={isHigh ? "text-sky-600 text-xs" : "text-amber-600 text-xs"}>
                          {isHigh ? "▲" : "▼"}
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {evt.timeFormatted}h
                        </span>
                      </div>

                      <div className="my-0.5">
                        <span
                          className={[
                            "text-sm font-extrabold",
                            isHigh ? "text-sky-700" : "text-amber-700"
                          ].join(" ")}
                        >
                          {evt.height.toFixed(1)}m
                        </span>
                      </div>

                      <span
                        className={[
                          "text-[9px] font-bold uppercase tracking-wider",
                          isHigh ? "text-sky-800" : "text-amber-800"
                        ].join(" ")}
                      >
                        {isHigh ? "Preamar" : "Baixa-mar"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumo Dinâmico do Comportamento da Maré durante o Passeio */}
            <div className="p-2.5 rounded-lg bg-gradient-to-r from-cyan-50 to-brand-foam/80 border border-cyan-200/70 text-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-deep">
                <span>⏱️</span>
                <span>
                  No Horário do seu Passeio ({includeSunset ? "09:00 às 17:30" : "09:00 às 16:00"}):
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {tides.tourWindowSummary}
              </p>
            </div>

            {/* Dica Náutica das Ilhas para a Maré deste Dia */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <span>💡</span>
                <span>Dica Especial para o Roteiro:</span>
              </div>
              <p className="leading-snug text-slate-700">
                <strong>Ilha dos Frades:</strong> {tides.islandAdvice.ilhaDosFrades}
              </p>
              <p className="leading-snug text-slate-700">
                <strong>Bom Jesus & Madre de Deus:</strong> {tides.islandAdvice.bomJesus}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
