import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Entre as Ilhas - Passeios de Lancha",
    short_name: "Entre as Ilhas",
    description: "Passeios exclusivos de lancha e experiências inesquecíveis na Baía de Todos-os-Santos",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0b1a2e",
    theme_color: "#0b1a2e",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "Roteiros & Passeios",
        short_name: "Roteiros",
        description: "Conheça nossos roteiros e ilhas paradisíacas",
        url: "/#roteiros",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }]
      },
      {
        name: "Experiência 360°",
        short_name: "360°",
        description: "Explore os pontos turísticos em 360 graus",
        url: "/#experiencia-360",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }]
      },
      {
        name: "Fale Conosco",
        short_name: "Contato",
        description: "Entre em contato e agende seu passeio",
        url: "/#contato",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }]
      }
    ]
  };
}
