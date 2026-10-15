"use client";

import Image from "next/image";
import Link from "next/link";
import type { MaintenanceSettings } from "@/lib/content-types";

interface UnderConstructionProps {
  maintenance?: MaintenanceSettings;
}

export function UnderConstruction({ maintenance }: UnderConstructionProps) {
  const title = maintenance?.title || "Estamos Preparando Novas Experiências";
  const subtitle =
    maintenance?.subtitle ||
    "Nosso novo portal está sendo finalizado com muito carinho para oferecer o melhor em passeios de lancha privativos, roteiros pelas ilhas e agendamento online na Baía de Todos-os-Santos.";
  const estimatedReturn = maintenance?.estimatedReturn || "Previsão de retorno: em breve!";
  const whatsappNumber = maintenance?.contactWhatsApp?.replace(/\D/g, "") || "5571992517102";
  const whatsappMessage =
    maintenance?.whatsappMessage ||
    "Olá! Vi que o site da Entre as Ilhas está em construção, mas gostaria de tirar dúvidas e consultar disponibilidade de passeios de lancha.";
  const instagramHandle = maintenance?.instagramHandle || "@entreasilhas";
  const instagramUrl = maintenance?.instagramUrl || "https://www.instagram.com/entreasilhas";
  const showAdminLink = maintenance?.showAdminLink ?? true;

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#040f22] text-white selection:bg-cyan-500 selection:text-white">
      {/* Background Cênico com Efeitos de Profundidade do Mar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Gradientes e Auras Luminosas */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70rem] h-[35rem] rounded-full bg-gradient-to-b from-cyan-500/20 via-sky-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-blue-700/15 blur-3xl" />
        <div className="absolute top-[40%] left-[-15%] w-[40rem] h-[40rem] rounded-full bg-teal-500/10 blur-3xl" />

        {/* Linhas de Ondas Náuticas em SVG Suave */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-20"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#0ea5e9"
            fillOpacity="0.3"
            d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,144C672,149,768,203,864,218.7C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="#0284c7"
            fillOpacity="0.4"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,218.7C672,203,768,149,864,133.3C960,117,1056,139,1152,165.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Topo: Logo & Badge */}
      <header className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-2xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 shadow-lg">
            <Image
              src="/images/logoeai.png"
              alt="Entre as Ilhas"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="block font-display text-lg sm:text-xl font-extrabold tracking-tight text-white leading-none">
              Entre as Ilhas
            </span>
            <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-widest">
              Turismo Náutico • Bahia
            </span>
          </div>
        </div>

        {/* Badge Pulsante de Status */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-cyan-300 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          <span className="uppercase tracking-wider text-[10px] sm:text-xs font-bold">
            Em Construção
          </span>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 py-12 sm:py-16 text-center space-y-8 my-auto">
        {/* Ícone de Destaque / Ilhas */}
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/20 to-teal-400/20 border border-cyan-400/30 text-4xl sm:text-5xl shadow-2xl backdrop-blur-md animate-pulse">
          🚤
        </div>

        {/* Textos Principais */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* Previsão de Lançamento */}
        {estimatedReturn && (
          <div className="inline-block rounded-2xl border border-amber-400/30 bg-amber-500/10 backdrop-blur-md px-5 py-2.5 shadow-lg">
            <p className="text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center gap-2">
              <span>⏳</span>
              <span>{estimatedReturn}</span>
            </p>
          </div>
        )}

        {/* Grid de Prévias: O Que Está Por Vir */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left pt-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-cyan-400/30 transition">
            <span className="text-2xl mb-2 block">⚓</span>
            <h3 className="font-bold text-xs sm:text-sm text-white">Lanchas Privativas</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Marinheiro habilitado, combustível e churrasqueira a bordo.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-cyan-400/30 transition">
            <span className="text-2xl mb-2 block">🏝️</span>
            <h3 className="font-bold text-xs sm:text-sm text-white">Ilhas Paradisíacas</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Ilha dos Frades, Bom Jesus dos Passos e Coroa do Frade.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-cyan-400/30 transition">
            <span className="text-2xl mb-2 block">🌐</span>
            <h3 className="font-bold text-xs sm:text-sm text-white">Tour 360° Interativo</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Explore cada praia em 360 graus antes mesmo de embarcar.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-cyan-400/30 transition">
            <span className="text-2xl mb-2 block">📅</span>
            <h3 className="font-bold text-xs sm:text-sm text-white">Reserva Online</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Planejamento de datas, pôr do sol e cardápio em instantes.
            </p>
          </div>
        </div>

        {/* Call to Actions Principais (WhatsApp & Instagram) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
          {/* Botão de WhatsApp Oficial */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 fill-current shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Fale Conosco no WhatsApp</span>
          </a>

          {/* Botão de Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>📸</span>
            <span>Seguir {instagramHandle}</span>
          </a>
        </div>
      </main>

      {/* Rodapé: Informações Legais & Acesso Administrativo Discreto */}
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Entre as Ilhas — Turismo Náutico. Salvador - BA.</p>

        {showAdminLink && (
          <Link
            href="/admin-painel"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition text-[11px] font-medium"
            title="Acesso Administrativo ao Painel"
          >
            <span>Acesso Administrativo</span>
            <span>🔐</span>
          </Link>
        )}
      </footer>
    </div>
  );
}
