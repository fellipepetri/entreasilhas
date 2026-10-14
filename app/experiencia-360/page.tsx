import type { Metadata } from "next";
import { PanoramaViewer } from "@/components/experience-360/panorama-viewer";

export const metadata: Metadata = {
  title: "Experiência 360° Interativa | Entre as Ilhas — Turismo Náutico",
  description:
    "Explore a Baía de Todos-os-Santos em 360 graus: Ilha dos Frades, Bom Jesus dos Passos, Coroa do Frade e muito mais com tour virtual interativo, fotos postais e reserva de passeios."
};

export default function Experiencia360Page() {
  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden bg-slate-950 text-white">
      {/* Visualizador 360 Standalone em Tela Cheia */}
      <PanoramaViewer isStandalone />
    </div>
  );
}
