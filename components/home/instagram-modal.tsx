"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import type { InstagramPost, InstagramProfile } from "@/data/instagram";

interface InstagramModalProps {
  post: InstagramPost;
  profile: InstagramProfile;
  currentIndex: number;
  totalPosts: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function HeartIcon({ filled, className = "w-6 h-6" }: { filled?: boolean; className?: string }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" fill="#ef4444" className={className} aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function CommentIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ShareIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="22" x2="11" y1="2" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function BookmarkIcon({ filled, className = "w-6 h-6" }: { filled?: boolean; className?: string }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" fill="#0f172a" className={className} aria-hidden="true">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function renderFormattedCaption(text: string) {
  const parts = text.split(/(\s+)/);
  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      return (
        <span key={i} className="text-sky-600 font-semibold hover:underline">
          {part}
        </span>
      );
    }
    if (part.startsWith("@")) {
      return (
        <span key={i} className="text-rose-600 font-semibold hover:underline">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function InstagramModal({
  post,
  profile,
  currentIndex,
  totalPosts,
  onClose,
  onPrev,
  onNext
}: InstagramModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Atualiza contagem quando muda de post
  useEffect(() => {
    setIsLiked(false);
    setLikesCount(post.likes);
    setIsSaved(false);
    setCopyFeedback(false);
  }, [post]);

  // Teclas de atalho: Escape (fechar), ArrowLeft (anterior), ArrowRight (próximo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  // Trava scroll da página de fundo enquanto o modal estiver aberto
  useEffect(() => {
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.classList.remove("modal-open");
    };
  }, []);

  function handleToggleLike() {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${profile.username} no Instagram`,
          text: post.caption.slice(0, 100),
          url: post.permalink
        });
        return;
      } catch {
        // usuário cancelou ou não suportado
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(post.permalink);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  }

  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (diff > 45) {
      onPrev();
    } else if (diff < -45) {
      onNext();
    }
    touchStartXRef.current = null;
  };

  // Link WhatsApp com contexto da publicação
  const whatsappUrl = `https://wa.me/5571992517102?text=${encodeURIComponent(
    `Olá! Vi a publicação de vocês no Instagram (${post.location}) e gostaria de mais informações sobre os passeios de lancha!`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Botão Fechar no canto superior direito */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-6 z-50 text-white/80 hover:text-white text-2xl sm:text-3xl font-light w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition"
        aria-label="Fechar modal do Instagram"
      >
        ✕
      </button>

      {/* Seta de navegação Desktop: Anterior */}
      {totalPosts > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="hidden lg:flex fixed left-3 xl:left-6 z-50 w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-slate-900/75 hover:bg-slate-900/95 text-white items-center justify-center border border-white/20 backdrop-blur-md transition shadow-2xl hover:scale-105 active:scale-95"
          aria-label="Publicação anterior"
          title="Publicação anterior (Seta esquerda)"
        >
          <span className="text-2xl leading-none -ml-0.5">‹</span>
        </button>
      )}

      {/* Seta de navegação Desktop: Próximo */}
      {totalPosts > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="hidden lg:flex fixed right-3 xl:right-6 z-50 w-11 h-11 xl:w-12 xl:h-12 rounded-full bg-slate-900/75 hover:bg-slate-900/95 text-white items-center justify-center border border-white/20 backdrop-blur-md transition shadow-2xl hover:scale-105 active:scale-95"
          aria-label="Próxima publicação"
          title="Próxima publicação (Seta direita)"
        >
          <span className="text-2xl leading-none -mr-0.5">›</span>
        </button>
      )}

      {/* Card do Modal Estilo Instagram Desktop/Mobile */}
      <div
        className="relative w-full max-w-5xl h-[92vh] h-[92dvh] max-h-[820px] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lado Esquerdo: Mídia da Publicação */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 lg:max-w-[58%] h-[38vh] sm:h-[45vh] lg:h-full bg-black flex items-center justify-center overflow-hidden"
        >
          {post.mediaType === "VIDEO" && post.videoUrl ? (
            <video
              src={post.videoUrl}
              poster={post.image}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src={post.image}
              alt={post.caption.slice(0, 80)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain"
            />
          )}

          {/* Badge superior com tipo de mídia */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow">
              <span>{post.mediaType === "VIDEO" ? "🎥 Reels" : post.mediaType === "CAROUSEL_ALBUM" ? "🎠 Álbum" : "📸 Foto"}</span>
              <span className="text-white/40">•</span>
              <span className="text-[10px] sm:text-[11px] text-slate-300">{currentIndex + 1} de {totalPosts}</span>
            </span>
          </div>

          {/* Setas móveis para smartphones e tablets sobre a mídia */}
          {totalPosts > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm shadow transition"
                aria-label="Publicação anterior"
              >
                <span className="text-xl leading-none -ml-0.5">‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm shadow transition"
                aria-label="Próxima publicação"
              >
                <span className="text-xl leading-none -mr-0.5">›</span>
              </button>
            </>
          )}
        </div>

        {/* Lado Direito: Informações do Post & Interações (Estilo Instagram Web) */}
        <div className="w-full lg:w-[42%] flex flex-col h-[54vh] sm:h-[47vh] lg:h-full bg-white text-slate-900 border-t lg:border-t-0 lg:border-l border-slate-100">
          {/* 1. Header do Perfil */}
          <div className="shrink-0 p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-sm">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white p-0.5">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    sizes="36px"
                    className="object-contain p-0.5"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-rose-600 transition">
                    {profile.username}
                  </span>
                  <span className="text-sky-500 text-[10px]">✓</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate max-w-[170px] sm:max-w-[210px]">
                  📍 {post.location}
                </p>
              </div>
            </a>

            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-900 transition flex items-center gap-1.5"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>Seguir</span>
            </a>
          </div>

          {/* 2. Corpo Rolável com a Legenda Completa */}
          <div
            data-native-scroll="true"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4"
          >
            {/* Bloco de Legenda do Post */}
            <div className="flex items-start gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 mt-0.5">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  sizes="32px"
                  className="object-contain p-0.5"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line">
                  <span className="font-bold text-slate-900 mr-1.5">
                    {profile.username}
                  </span>
                  {renderFormattedCaption(post.caption)}
                </p>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-600 transition"
                  >
                    Ver original no Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Chamada para reserva e turismo náutico */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-brand-deep font-bold text-xs">
                <span>🚤</span>
                <span>Gostou desse destino?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Navegue pelas praias de {post.location} a bordo de nossas lanchas exclusivas.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-sm w-full justify-center"
              >
                <span>Conversar no WhatsApp</span>
                <span>💬</span>
              </a>
            </div>
          </div>

          {/* 3. Rodapé Fixo com Botões de Ação do Instagram */}
          <div className="shrink-0 p-3.5 sm:p-4 border-t border-slate-100 bg-white space-y-3">
            {/* Linha de Ícones de Ação */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-800">
                {/* Like */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className="transition hover:scale-110 active:scale-95 focus:outline-none"
                  aria-label={isLiked ? "Descurtir" : "Curtir"}
                  title="Curtir"
                >
                  <HeartIcon filled={isLiked} className="w-6 h-6 text-slate-800" />
                </button>

                {/* Comentar */}
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:scale-110 active:scale-95 text-slate-800 hover:text-slate-950"
                  aria-label="Comentar no Instagram"
                  title="Comentar no Instagram"
                >
                  <CommentIcon className="w-6 h-6" />
                </a>

                {/* Compartilhar */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="transition hover:scale-110 active:scale-95 text-slate-800 hover:text-slate-950 focus:outline-none relative"
                  aria-label="Compartilhar"
                  title="Compartilhar link do post"
                >
                  <ShareIcon className="w-6 h-6" />
                  {copyFeedback && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] whitespace-nowrap animate-fadeIn">
                      Link copiado!
                    </span>
                  )}
                </button>
              </div>

              {/* Salvar */}
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className="transition hover:scale-110 active:scale-95 text-slate-800 focus:outline-none"
                aria-label={isSaved ? "Remover dos salvos" : "Salvar"}
                title="Salvar"
              >
                <BookmarkIcon filled={isSaved} className="w-6 h-6" />
              </button>
            </div>

            {/* Contador de Curtidas e Data */}
            <div>
              <p className="font-bold text-xs sm:text-sm text-slate-900">
                {likesCount.toLocaleString("pt-BR")} curtidas
              </p>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
                {post.date} • PUBLICADO NO INSTAGRAM
              </p>
            </div>

            {/* Botão de Destaque: Abrir no Instagram Oficial */}
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md hover:scale-[1.01]"
            >
              <InstagramIcon className="w-4 h-4 text-white" />
              <span>Ver publicação original no Instagram</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
