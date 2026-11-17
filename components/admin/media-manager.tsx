"use client";

import { useState, useEffect, useCallback } from "react";

interface MediaItem {
  fileName: string;
  url: string;
  size: number;
  formattedSize: string;
  type: "video" | "image" | "other";
  extension: string;
  updatedAt: string;
  usedIn: string[];
  isOrphan: boolean;
}

interface MediaStats {
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  imagesCount: number;
  videosCount: number;
  orphanedCount: number;
}

export function MediaManager() {
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "video" | "image" | "orphan">("all");

  // Ações de Exclusão
  const [deletingFileName, setDeletingFileName] = useState<string | null>(null);
  const [filePendingDelete, setFilePendingDelete] = useState<MediaItem | null>(null);
  const [isDeletingOrphans, setIsDeletingOrphans] = useState(false);
  const [confirmDeleteOrphansOpen, setConfirmDeleteOrphansOpen] = useState(false);

  // Copiar link feedback
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Modal de Pré-visualização
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao carregar arquivos de mídia.");
      }
      setFiles(data.files || []);
      setStats(data.stats || null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDeleteSingle = async (fileName: string) => {
    setDeletingFileName(fileName);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao excluir o arquivo.");
      }
      setSuccessMessage(`Arquivo "${fileName}" excluído com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setFilePendingDelete(null);
      await fetchMedia();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao excluir arquivo.");
    } finally {
      setDeletingFileName(null);
    }
  };

  const handleDeleteOrphans = async () => {
    setIsDeletingOrphans(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteOrphaned: true })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao limpar arquivos órfãos.");
      }
      setSuccessMessage(data.message || "Arquivos não utilizados excluídos com sucesso!");
      setTimeout(() => setSuccessMessage(null), 4000);
      setConfirmDeleteOrphansOpen(false);
      await fetchMedia();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro na limpeza.");
    } finally {
      setIsDeletingOrphans(false);
    }
  };

  // Filtragem dos arquivos
  const filteredFiles = files.filter((item) => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFilter === "video") return item.type === "video";
    if (selectedFilter === "image") return item.type === "image";
    if (selectedFilter === "orphan") return item.isOrphan;
    return true;
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* Topo do Gerenciador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
            <span>📁</span>
            <span>Armazenamento & Mídias</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Gerenciador de Mídias Enviadas
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Visualize todos os vídeos e fotos enviados ao servidor, identifique onde cada mídia está sendo usada no site e exclua arquivos de teste para liberar espaço em disco.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={fetchMedia}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
            title="Atualizar lista de mídias"
          >
            <span className={isLoading ? "animate-spin inline-block" : ""}>🔄</span>
            <span>Atualizar</span>
          </button>

          {stats && stats.orphanedCount > 0 && (
            <button
              type="button"
              onClick={() => setConfirmDeleteOrphansOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition hover:scale-[1.02] active:scale-[0.99]"
              title="Excluir de uma só vez todas as mídias não vinculadas"
            >
              <span>🧹</span>
              <span>Limpar Órfãos ({stats.orphanedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2.5 animate-fadeIn">
          <span className="text-base">✅</span>
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-800 flex items-center gap-2.5 animate-fadeIn">
          <span className="text-base">⚠️</span>
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Cartões com Métricas de Armazenamento */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <span className="text-xs text-slate-500 font-medium">Total de Mídias</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {stats.totalFiles}
              </span>
              <span className="text-xs text-slate-400">arquivos</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <span className="text-xs text-slate-500 font-medium">Espaço Ocupado</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-brand-sea">
                {stats.totalSizeFormatted}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <span className="text-xs text-slate-500 font-medium">Vídeos & Fotos</span>
            <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1">
                <span>🎥</span> {stats.videosCount} vídeos
              </span>
              <span className="inline-flex items-center gap-1">
                <span>🖼️</span> {stats.imagesCount} fotos
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <span className="text-xs text-amber-800 font-medium">Não Utilizados (Órfãos)</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-amber-700">
                {stats.orphanedCount}
              </span>
              <span className="text-xs text-amber-600 font-medium">pode excluir</span>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Todos ({files.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("video")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedFilter === "video"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            🎥 Vídeos ({stats?.videosCount || 0})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("image")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedFilter === "image"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            🖼️ Imagens ({stats?.imagesCount || 0})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("orphan")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedFilter === "orphan"
                ? "bg-amber-500 text-white"
                : "bg-amber-100 hover:bg-amber-200 text-amber-800"
            }`}
          >
            ⚠️ Órfãos ({stats?.orphanedCount || 0})
          </button>
        </div>

        <div className="relative sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome de arquivo..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-sea focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Lista / Tabela de Mídias */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
          <span className="w-6 h-6 border-2 border-slate-300 border-t-brand-deep rounded-full animate-spin" />
          <span>Carregando mídias do servidor...</span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 p-6">
          <span className="text-3xl block mb-2">🌊</span>
          <p className="text-sm font-semibold text-slate-700">
            Nenhuma mídia encontrada
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm
              ? "Tente buscar por outro termo."
              : selectedFilter === "orphan"
              ? "Parabéns! Não há arquivos órfãos sem uso no servidor."
              : "Nenhum arquivo enviado para a pasta /public/uploads ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => (
            <div
              key={file.fileName}
              className={`rounded-2xl border p-3.5 sm:p-4 transition flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                file.isOrphan
                  ? "border-amber-200 bg-amber-50/30 hover:bg-amber-50/50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Miniatura / Preview */}
              <div
                onClick={() => setPreviewMedia(file)}
                className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl bg-slate-900 overflow-hidden relative shrink-0 cursor-pointer group shadow-inner border border-slate-200"
                title="Clique para visualizar em tela cheia"
              >
                {file.type === "video" ? (
                  <>
                    <video
                      src={file.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm group-hover:scale-110 transition">
                      ▶
                    </div>
                  </>
                ) : file.type === "image" ? (
                  <img
                    src={file.url}
                    alt={file.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    📄
                  </div>
                )}

                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-white uppercase">
                  {file.extension}
                </span>
              </div>

              {/* Informações do Arquivo */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className="font-mono text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md"
                    title={file.fileName}
                  >
                    {file.fileName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold font-mono">
                    {file.formattedSize}
                  </span>
                </div>

                {/* Onde a mídia está aplicada */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Uso no site:</span>
                  {file.usedIn.length > 0 ? (
                    file.usedIn.map((loc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-bold border border-cyan-200"
                      >
                        <span>📍</span>
                        <span>{loc}</span>
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200">
                      <span>⚠️</span>
                      <span>Não Utilizado (Órfão - seguro para excluir)</span>
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 mt-1">
                  Enviado em: {new Date(file.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(file.updatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleCopy(file.url)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    copiedUrl === file.url
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                  title="Copiar URL para colar nos campos do painel"
                >
                  <span>{copiedUrl === file.url ? "✓" : "📋"}</span>
                  <span>{copiedUrl === file.url ? "Copiado!" : "Copiar Link"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMedia(file)}
                  className="p-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs transition"
                  title="Visualizar mídia"
                >
                  👁️
                </button>

                <button
                  type="button"
                  disabled={deletingFileName === file.fileName}
                  onClick={() => setFilePendingDelete(file)}
                  className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs transition disabled:opacity-50"
                  title="Excluir arquivo do servidor"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão Individual */}
      {filePendingDelete && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto">
              🗑️
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Confirmar Exclusão de Mídia
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-mono bg-slate-50 p-2 rounded-xl border border-slate-200 break-all">
                {filePendingDelete.fileName}
              </p>
            </div>

            {filePendingDelete.usedIn.length > 0 ? (
              <div className="rounded-2xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>⚠️</span> Atenção: Esta mídia está em uso no site!
                </p>
                <p className="text-[11px] leading-tight text-rose-700">
                  Ela está aplicada em:{" "}
                  <strong>{filePendingDelete.usedIn.join(", ")}</strong>. Se você excluir, o item correspondente deixará de exibir a foto/vídeo.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <p>
                  Esta mídia <strong>não está vinculada a nenhuma seção do site</strong>. Pode ser excluída com segurança para liberar espaço.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFilePendingDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deletingFileName === filePendingDelete.fileName}
                onClick={() => handleDeleteSingle(filePendingDelete.fileName)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {deletingFileName === filePendingDelete.fileName
                  ? "Excluindo..."
                  : "Sim, Excluir Definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Limpeza em Massa de Órfãos */}
      {confirmDeleteOrphansOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
              🧹
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Limpar Todos os Arquivos Órfãos?
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Essa ação irá excluir permanentemente todos os <strong>{stats?.orphanedCount}</strong> arquivos que não estão sendo usados em nenhum slide do Hero, Roteiro, Galeria ou Chamada Final.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteOrphansOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeletingOrphans}
                onClick={handleDeleteOrphans}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {isDeletingOrphans ? "Excluindo arquivos..." : "Confirmar Limpeza"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pré-visualização de Mídia */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl text-white flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="truncate pr-4">
                <p className="text-xs font-mono font-bold text-white truncate">
                  {previewMedia.fileName}
                </p>
                <p className="text-[11px] text-cyan-300 mt-0.5">
                  {previewMedia.formattedSize} • {previewMedia.extension}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="text-slate-400 hover:text-white p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-black/60 flex items-center justify-center max-h-[60vh]">
              {previewMedia.type === "video" ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[55vh] max-w-full rounded-xl"
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.fileName}
                  className="max-h-[55vh] max-w-full rounded-xl object-contain"
                />
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                Uso:{" "}
                <span className="text-white font-medium">
                  {previewMedia.usedIn.length > 0
                    ? previewMedia.usedIn.join(", ")
                    : "Não utilizado (Órfão)"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(previewMedia.url)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                {copiedUrl === previewMedia.url ? "✓ Copiado!" : "Copiar URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
