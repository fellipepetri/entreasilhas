import type { Metadata } from "next";
import { PanoramaViewer } from "@/components/experience-360/panorama-viewer";
import { getSiteContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Experiência 360° Interativa | Entre as Ilhas — Turismo Náutico",
  description:
    "Explore a Baía de Todos-os-Santos em 360 graus: Ilha dos Frades, Bom Jesus dos Passos, Coroa do Frade e muito mais com tour virtual interativo, fotos postais e reserva de passeios."
};

export default async function Experiencia360Page() {
  const content = await getSiteContent().catch(() => null);

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden bg-slate-950 text-white">
      {/* Visualizador 360 Standalone em Tela Cheia */}
      <PanoramaViewer
        isStandalone
        scenes={content?.experience360?.scenes}
        secretsCatalog={content?.experience360?.secretsCatalog}
        totalSecretsCount={content?.experience360?.totalSecretsCount}
      />
    </div>
  );
}

