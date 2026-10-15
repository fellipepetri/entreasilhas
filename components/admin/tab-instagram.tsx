"use client";

import { useState } from "react";
import type { InstagramPost, InstagramProfile } from "@/lib/content-types";
import { ImageUploader } from "./image-uploader";

interface TabInstagramProps {
  profile: InstagramProfile;
  posts: InstagramPost[];
  onChangeProfile: (profile: InstagramProfile) => void;
  onChangePosts: (posts: InstagramPost[]) => void;
}

export function TabInstagram({
  profile,
  posts,
  onChangeProfile,
  onChangePosts
}: TabInstagramProps) {
  const [subTab, setSubTab] = useState<"profile" | "posts">("profile");
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  const currentPost = posts[selectedPostIndex] || posts[0];

  const handleUpdateProfile = (field: keyof InstagramProfile, value: unknown) => {
    onChangeProfile({
      ...profile,
      [field]: value
    });
  };

  const handleUpdatePost = (field: keyof InstagramPost, value: unknown) => {
    const updated = [...posts];
    updated[selectedPostIndex] = {
      ...updated[selectedPostIndex],
      [field]: value
    };
    onChangePosts(updated);
  };

  const handleAddPost = () => {
    const newPost: InstagramPost = {
      id: `post-${Date.now()}`,
      image: "/images/instagram/post-1.jpg",
      caption: "Novo post incrível navegando pelas águas calmas da Baía de Todos-os-Santos! 🌴🚤 #entreasilhas",
      permalink: "https://www.instagram.com/entreasilhas",
      likes: 1200,
      comments: 45,
      mediaType: "IMAGE",
      date: "Há 1 dia",
      location: "Baía de Todos-os-Santos, BA"
    };
    const nextList = [...posts, newPost];
    onChangePosts(nextList);
    setSelectedPostIndex(nextList.length - 1);
  };

  const handleDeletePost = (idx: number) => {
    if (posts.length <= 1) {
      alert("Mantenha pelo menos um post cadastrado.");
      return;
    }
    if (confirm("Remover este post do feed?")) {
      const nextList = posts.filter((_, i) => i !== idx);
      onChangePosts(nextList);
      setSelectedPostIndex(Math.max(0, idx - 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Instagram & Mídias Sociais
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure o perfil oficial e a grade de publicações destacadas no rodapé.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab("profile")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "profile"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            📸 Perfil (@{profile.username})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("posts")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "posts"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            🖼️ Posts Curados ({posts.length})
          </button>
        </div>
      </div>

      {/* SUB-ABA 1: PERFIL */}
      {subTab === "profile" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 max-w-3xl">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Informações do Perfil do Instagram
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Nome de Usuário (@)
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => handleUpdateProfile("username", e.target.value)}
                placeholder="entreasilhas"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Nome de Exibição
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleUpdateProfile("name", e.target.value)}
                placeholder="E N T R E   A S   I L H A S"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Contador de Seguidores (Texto)
              </label>
              <input
                type="text"
                value={profile.followers}
                onChange={(e) => handleUpdateProfile("followers", e.target.value)}
                placeholder="108 mil"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Contador de Publicações
              </label>
              <input
                type="text"
                value={profile.postsCount}
                onChange={(e) => handleUpdateProfile("postsCount", e.target.value)}
                placeholder="2.500+"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Biografia do Instagram
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => handleUpdateProfile("bio", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Localização
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleUpdateProfile("location", e.target.value)}
              placeholder="Salvador / Baía de Todos-os-Santos, BA"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>

          <ImageUploader
            label="Avatar / Foto do Perfil"
            value={profile.avatarUrl}
            onChange={(url) => handleUpdateProfile("avatarUrl", url)}
            previewHeightClass="h-28 w-28"
          />
        </div>
      )}

      {/* SUB-ABA 2: POSTS CURADOS */}
      {subTab === "posts" && (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Posts ({posts.length})
              </span>
              <button
                type="button"
                onClick={handleAddPost}
                className="text-xs text-brand-sea hover:underline font-bold"
              >
                + Novo Post
              </button>
            </div>

            <div className="space-y-2">
              {posts.map((post, idx) => {
                const isSelected = idx === selectedPostIndex;
                return (
                  <div
                    key={post.id || idx}
                    onClick={() => setSelectedPostIndex(idx)}
                    className={[
                      "flex items-center justify-between gap-2 p-3 rounded-2xl border transition cursor-pointer",
                      isSelected
                        ? "bg-cyan-50/80 border-cyan-400 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        Post #{idx + 1}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {post.caption}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(idx);
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

          {currentPost && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Editando Post #{selectedPostIndex + 1}
              </h3>

              <ImageUploader
                label="Imagem do Post"
                value={currentPost.image}
                onChange={(url) => handleUpdatePost("image", url)}
                helperText="Imagem quadrada (1:1) com boa definição."
                previewHeightClass="h-48"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Legenda do Post
                </label>
                <textarea
                  rows={4}
                  value={currentPost.caption}
                  onChange={(e) => handleUpdatePost("caption", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Curtidas (Número)
                  </label>
                  <input
                    type="number"
                    value={currentPost.likes}
                    onChange={(e) => handleUpdatePost("likes", Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Comentários (Número)
                  </label>
                  <input
                    type="number"
                    value={currentPost.comments}
                    onChange={(e) => handleUpdatePost("comments", Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Data Relativa
                  </label>
                  <input
                    type="text"
                    value={currentPost.date}
                    onChange={(e) => handleUpdatePost("date", e.target.value)}
                    placeholder="Ex: Há 2 dias"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Localização da Foto
                  </label>
                  <input
                    type="text"
                    value={currentPost.location}
                    onChange={(e) => handleUpdatePost("location", e.target.value)}
                    placeholder="Ilha dos Frades, Bahia"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
