import type { SiteContent } from "@/lib/content-types";
import {
  aboutStats,
  heroSlides,
  routeItems,
  showcaseCards,
  testimonials
} from "./home";
import {
  PANORAMA_SCENES,
  REGIONAL_SECRETS_CATALOG,
  TOTAL_SECRETS_COUNT
} from "./experience-360";
import { tours } from "./tours";
import { CURATED_INSTAGRAM_POSTS, INSTAGRAM_PROFILE } from "./instagram";

export const defaultSiteContent: SiteContent = {
  heroSlides: heroSlides.map((slide, index) => ({
    id: `hero-slide-${index + 1}`,
    image: slide.image,
    alt: slide.alt,
    title: slide.title,
    stat: slide.stat,
    statLabel: slide.statLabel,
    description: slide.description
  })),
  about: {
    eyebrow: "Quem somos",
    title: "Explorando a beleza entre ondas, ilhas e marés.",
    paragraph1:
      "Organizamos experiências náuticas e roteiros costeiros com foco em conforto, clareza logística e visual tropical.",
    paragraph2:
      "A proposta visual e de navegação segue a essência da Baía de Todos-os-Santos: praias paradisíacas, mar calmo de enseadas e embarcações privativas com segurança total.",
    stats: aboutStats.map((item) => ({ ...item })),
    mainImage: "/images/about-main.svg",
    secondaryImage: "/images/about-secondary.svg"
  },
  routes: {
    homeItems: routeItems.map((item, index) => ({
      id: `route-item-${index + 1}`,
      title: item.title,
      description: item.description,
      image: item.image,
      link: "/passeios"
    })),
    tours: tours.map((t) => ({ ...t }))
  },
  gallery: {
    eyebrow: "Adventure Showcase",
    title: "Galeria com recortes grandes e parallax dentro da moldura.",
    cards: showcaseCards.map((card, index) => ({
      id: `gallery-card-${index + 1}`,
      title: card.title,
      image: card.image,
      size: card.size as "small" | "medium" | "large" | "wide"
    }))
  },
  experience360: {
    badge: "Entre as Ilhas 360º",
    title: "ENTRE AS ILHAS",
    highlight: "360°",
    subtitle: "Explore. Descubra. Viva a Baía antes mesmo de embarcar.",
    description:
      "Arraste com o mouse ou gire o smartphone para olhar em todas as direções. Conecte-se com as praias da Ilha dos Frades, o cais de Bom Jesus dos Passos e os bancos de areia da Coroa do Frade.",
    scenes: JSON.parse(JSON.stringify(PANORAMA_SCENES)),
    secretsCatalog: JSON.parse(JSON.stringify(REGIONAL_SECRETS_CATALOG)),
    totalSecretsCount: TOTAL_SECRETS_COUNT
  },
  testimonials: testimonials.map((item, index) => ({
    id: `testimonial-${index + 1}`,
    name: item.name,
    quote: item.quote,
    image: item.image,
    rating: item.rating
  })),
  instagram: {
    profile: JSON.parse(JSON.stringify(INSTAGRAM_PROFILE)),
    curatedPosts: JSON.parse(JSON.stringify(CURATED_INSTAGRAM_POSTS))
  },
  settings: {
    siteName: "Entre as Ilhas",
    whatsappNumber: "5571992517102",
    whatsappFormatted: "+55 (71) 99251-7102",
    whatsappDefaultMessage:
      "Olá! Gostaria de informações sobre os passeios de lancha da Entre as Ilhas.",
    instagramHandle: "@entreasilhas",
    instagramUrl: "https://www.instagram.com/entreasilhas",
    maintenance: {
      enabled: false,
      title: "Estamos Preparando Novas Experiências",
      subtitle:
        "Nosso novo portal está sendo finalizado com muito carinho para oferecer o melhor em passeios de lancha privativos, roteiros pelas ilhas e agendamento online na Baía de Todos-os-Santos.",
      estimatedReturn: "Previsão de retorno: em breve!",
      contactWhatsApp: "5571992517102",
      whatsappMessage:
        "Olá! Vi que o site da Entre as Ilhas está em construção, mas gostaria de tirar dúvidas e consultar disponibilidade de passeios de lancha.",
      instagramHandle: "@entreasilhas",
      instagramUrl: "https://www.instagram.com/entreasilhas",
      allowAdminBypass: true,
      showAdminLink: true
    }
  },
  lastUpdated: new Date().toISOString()
};
