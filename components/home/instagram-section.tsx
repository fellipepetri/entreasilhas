"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  INSTAGRAM_PROFILE,
  CURATED_INSTAGRAM_POSTS,
  type InstagramPost,
  type InstagramProfile
} from "@/data/instagram";
import { InstagramModal } from "@/components/home/instagram-modal";

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

function HeartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CommentIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-500 text-white text-[10px]"
      title="Perfil Oficial Entre as Ilhas"
      aria-label="Verificado"
    >
      ✓
    </span>
  );
}

function renderCaptionWithHashtags(caption: string) {
  const parts = caption.split(/(\s+)/);
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

export function InstagramSection() {
  const [profile, setProfile] = useState<InstagramProfile>(INSTAGRAM_PROFILE);
  const [posts, setPosts] = useState<InstagramPost[]>(CURATED_INSTAGRAM_POSTS);
  const [isLive, setIsLive] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);

  const handleCloseModal = () => setSelectedPostIndex(null);
  const handlePrevModal = () => {
    setSelectedPostIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : posts.length - 1));
  };
  const handleNextModal = () => {
    setSelectedPostIndex((prev) => (prev !== null && prev < posts.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch("/api/instagram");
        if (res.ok) {
          const data = await res.json();
          if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
            setPosts(data.posts);
          }
          if (data.profile) {
            setProfile(data.profile);
          }
          setIsLive(Boolean(data.isLive));
        }
      } catch (err) {
        console.warn("Utilizando feed curado do Instagram:", err);
      }
    }

    loadFeed();
  }, []);

  return (
    <section id="instagram" className="scroll-mt-20 lg:scroll-mt-24 relative overflow-hidden bg-white py-24 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        {/* Cabeçalho da Seção com Card do Perfil Oficial */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-100 pb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-bold uppercase tracking-widest mb-3">
              <InstagramIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>Instagram Oficial</span>
              {isLive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
            </div>

            <h2 className="font-display text-[clamp(2.2rem,5.5vw,3.6rem)] font-bold tracking-tight text-brand-deep leading-[1.08]">
              Últimos posts de <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">@{profile.username}</span>
            </h2>

            <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
              Acompanhe as saídas de lancha, condições de maré, enseadas secretas e a vida paradisíaca na Baía de Todos-os-Santos em tempo real.
            </p>
          </div>

          {/* Destaque do Perfil + Botão Seguir */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            {/* Avatar com degradê do Instagram */}
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 group"
            >
              <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-sm transition-transform group-hover:scale-105">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-1">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition">
                    @{profile.username}
                  </p>
                  <VerifiedBadge />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {profile.followers} seguidores • {profile.postsCount} posts
                </p>
              </div>
            </a>

            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
            >
              <InstagramIcon className="w-4 h-4 text-white" />
              <span>Seguir Perfil</span>
            </a>
          </div>
        </div>

        {/* Grid Responsivo de Publicações */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.id}
              onClick={() => setSelectedPostIndex(index)}
              className="group flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border border-slate-100 cursor-pointer"
            >
              {/* Moldura da Foto */}
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-slate-100">
                <Image
                  src={post.image}
                  alt={post.caption.slice(0, 80)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Badges superiores flutuantes */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/60 backdrop-blur-md text-white border border-white/20">
                    {post.mediaType === "VIDEO"
                      ? "🎥 Reels"
                      : post.mediaType === "CAROUSEL_ALBUM"
                      ? "🎠 Álbum"
                      : "📸 Foto"}
                  </span>

                  <span className="w-7 h-7 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Overlay interativo ao passar o mouse */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white z-20 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                      <span>📍</span>
                      <span className="font-medium truncate">{post.location}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white">
                      Ver detalhes
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Estatísticas de Curtidas e Comentários */}
                    <div className="flex items-center gap-5 font-bold text-sm">
                      <span className="flex items-center gap-1.5 text-rose-300">
                        <HeartIcon className="w-4 h-4 text-rose-400" />
                        {post.likes.toLocaleString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <CommentIcon className="w-4 h-4 text-cyan-400" />
                        {post.comments.toLocaleString("pt-BR")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPostIndex(index);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition"
                      >
                        <span>Abrir modal</span>
                        <span>🔍</span>
                      </button>

                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition border border-white/30 text-xs shrink-0"
                        title="Abrir no Instagram"
                        aria-label="Abrir no Instagram"
                      >
                        ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações e Legenda da Publicação */}
              <div className="mt-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold text-slate-700">@{profile.username}</span>
                    <span className="text-[11px] text-slate-400">{post.date}</span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                    {renderCaptionWithHashtags(post.caption)}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-[150px]">
                    📍 {post.location}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPostIndex(index);
                      }}
                      className="font-bold text-rose-600 hover:text-rose-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver post</span>
                      <span>🔍</span>
                    </button>

                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-slate-600 transition text-[11px] font-medium"
                      title="Abrir diretamente no Instagram"
                    >
                      ↗
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Faixa Inferior de Engajamento */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-deep to-slate-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg text-white text-xl">
              📸
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Vai navegar com a gente? Marque <span className="text-rose-400">@entreasilhas</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Compartilhe suas fotos na Baía de Todos-os-Santos para aparecer em nossos stories e destaques oficiais!
              </p>
            </div>
          </div>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold px-7 py-3 text-sm transition shadow-lg hover:scale-105"
          >
            <InstagramIcon className="w-4 h-4 text-rose-600" />
            <span>Acessar @entreasilhas</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Modal Interativo Estilo Instagram Web */}
      {selectedPostIndex !== null && posts[selectedPostIndex] && (
        <InstagramModal
          post={posts[selectedPostIndex]}
          profile={profile}
          currentIndex={selectedPostIndex}
          totalPosts={posts.length}
          onClose={handleCloseModal}
          onPrev={handlePrevModal}
          onNext={handleNextModal}
        />
      )}
    </section>
  );
}
