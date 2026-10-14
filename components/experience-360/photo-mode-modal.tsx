"use client";

import { useEffect, useRef, useState } from "react";
import type { PanoramaScene } from "@/data/experience-360";

interface PhotoModeModalProps {
  imageDataUrl: string | null;
  currentScene: PanoramaScene;
  onClose: () => void;
}

export function PhotoModeModal({
  imageDataUrl,
  currentScene,
  onClose
}: PhotoModeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Gera o cartão postal no Canvas
  useEffect(() => {
    if (!imageDataUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageDataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Tamanho padrão do cartão postal de alta resolução (1200 x 900)
      const targetW = 1200;
      const targetH = 900;
      canvas.width = targetW;
      canvas.height = targetH;

      // 1. Fundo do cartão postal estilo papel encorpado náutico
      const bgGrad = ctx.createLinearGradient(0, 0, 0, targetH);
      bgGrad.addColorStop(0, "#0a192f");
      bgGrad.addColorStop(1, "#040d1a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetW, targetH);

      // Borda interna decorativa dourada
      ctx.strokeStyle = "rgba(244, 225, 161, 0.4)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, targetW - 60, targetH - 60);

      // 2. Desenhar a foto capturada
      const photoMargin = 48;
      const photoW = targetW - photoMargin * 2;
      const photoH = targetH - 230; // espaço para o rodapé do postal

      // Borda e sombra da foto
      ctx.fillStyle = "#000000";
      ctx.fillRect(photoMargin - 4, photoMargin - 4, photoW + 8, photoH + 8);

      // Desenha a imagem cortando mantendo o aspect ratio do quadro
      ctx.drawImage(img, photoMargin, photoMargin, photoW, photoH);

      // Overlay sutil de vinheta na foto
      const vigGrad = ctx.createRadialGradient(
        photoMargin + photoW / 2,
        photoMargin + photoH / 2,
        photoW * 0.3,
        photoMargin + photoW / 2,
        photoMargin + photoH / 2,
        photoW * 0.7
      );
      vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      vigGrad.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(photoMargin, photoMargin, photoW, photoH);

      // 3. Rodapé do Postal Náutico
      const footerY = photoMargin + photoH + 36;

      // Título do local
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 34px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(currentScene.title.toUpperCase(), photoMargin + 10, footerY);

      // Subtítulo e Baía de Todos-os-Santos
      ctx.fillStyle = "#38bdf8";
      ctx.font = "20px sans-serif";
      ctx.fillText(
        "Baía de Todos-os-Santos • Salvador - BA",
        photoMargin + 10,
        footerY + 34
      );

      // Data e hora da exploração
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px monospace";
      const now = new Date();
      const dateStr = now.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      ctx.fillText(dateStr, photoMargin + 10, footerY + 62);

      // Assinatura da marca Entre as Ilhas no canto direito
      ctx.textAlign = "right";
      ctx.fillStyle = "#f4e1a1";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("Entre as Ilhas", targetW - photoMargin - 10, footerY);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "italic 18px sans-serif";
      ctx.fillText("Turismo Náutico & Experiências", targetW - photoMargin - 10, footerY + 30);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.fillText("entreasilhas.com.br", targetW - photoMargin - 10, footerY + 58);

      // Carimbo náutico decorativo circular
      ctx.save();
      ctx.translate(targetW - photoMargin - 420, footerY + 16);
      ctx.strokeStyle = "rgba(229, 180, 40, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(229, 180, 40, 0.7)";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("360° TOUR", 0, -4);
      ctx.fillText("VERIFICADO", 0, 10);
      ctx.restore();

      const resultUrl = canvas.toDataURL("image/png");
      setCompositeUrl(resultUrl);
      setIsGenerating(false);
    };
  }, [imageDataUrl, currentScene]);

  function handleDownload() {
    if (!compositeUrl) return;
    const a = document.createElement("a");
    a.href = compositeUrl;
    a.download = `entre-as-ilhas-360-${currentScene.id}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleShare() {
    if (!compositeUrl) return;
    try {
      if (navigator.share) {
        const blob = await (await fetch(compositeUrl)).blob();
        const file = new File([blob], `postal-entre-as-ilhas-${currentScene.id}.png`, {
          type: "image/png"
        });
        await navigator.share({
          title: `Cartão Postal 360°: ${currentScene.title}`,
          text: `Olha que vista maravilhosa explorei no tour 360° do Entre as Ilhas na Baía de Todos-os-Santos!`,
          files: [file]
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  }

  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fechar modal ao pressionar tecla Escape (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Bloqueia qualquer rolagem ao girar scroll no backdrop escuro
  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    const handleBackdropWheel = (e: WheelEvent) => {
      if (e.target === backdrop) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    backdrop.addEventListener("wheel", handleBackdropWheel, { passive: false });
    return () => backdrop.removeEventListener("wheel", handleBackdropWheel);
  }, []);

  // Direciona o scroll para o corpo do modal mesmo se o cursor estiver sobre o cabeçalho ou rodapé
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleCardWheel = (e: WheelEvent) => {
      const scrollBody = card.querySelector<HTMLElement>("[data-modal-scroll='true']");
      if (!scrollBody) return;

      const target = e.target as HTMLElement | null;
      const isInsideScroll = Boolean(target?.closest("[data-modal-scroll='true']"));

      if (!isInsideScroll) {
        e.preventDefault();
        scrollBody.scrollTop += e.deltaY;
      }
    };

    card.addEventListener("wheel", handleCardWheel, { passive: false });
    return () => card.removeEventListener("wheel", handleCardWheel);
  }, []);

  return (
    <div
      ref={backdropRef}
      data-modal-container="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-2.5 sm:px-6 pt-14 sm:pt-24 pb-2.5 sm:pb-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        data-modal-card="true"
        data-native-scroll="true"
        className="relative w-full max-w-2xl max-h-full flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-white/20 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
                Modo Fotógrafo — Cartão Postal 360°
              </h3>
              <p className="text-xs text-slate-400">
                Seu enquadramento exclusivo registrado com a marca Entre as Ilhas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition focus:outline-none"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Visualização do Postal gerado */}
        <div
          data-modal-scroll="true"
          data-native-scroll="true"
          className="flex-1 min-h-0 p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-950 overflow-y-auto overscroll-contain"
        >
          {isGenerating ? (
            <div className="py-24 flex flex-col items-center gap-3">
              <span className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-300">Criando seu cartão postal náutico...</p>
            </div>
          ) : (
            compositeUrl && (
              <div className="w-full max-h-[58vh] overflow-hidden rounded-2xl shadow-2xl border border-white/10 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compositeUrl}
                  alt={`Cartão postal ${currentScene.title}`}
                  className="w-full h-auto object-contain max-h-[56vh] rounded-xl"
                />
              </div>
            )
          )}
        </div>

        {/* Rodapé com Ações */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Compartilhe nas redes sociais marcando <strong className="text-cyan-300">@entreasilhas</strong>!
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <span>Compartilhar</span>
              <span>📤</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-bold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>Baixar Foto (PNG)</span>
              <span>💾</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
