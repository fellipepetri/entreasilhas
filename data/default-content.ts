import type { SiteContent, SiteFeatures } from "@/lib/content-types";

export const defaultSiteFeatures: SiteFeatures = {
  experience360: true,
  routes: true,
  gallery: true,
  testimonials: true,
  instagram: true,
  about: true,
  booking: true,
  cta: true
};
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
import { BOOKING_ROUTES } from "./booking";
import { CURATED_INSTAGRAM_POSTS, INSTAGRAM_PROFILE } from "./instagram";

export const defaultSiteContent: SiteContent = {
  heroSlides: heroSlides.map((slide, index) => ({
    id: `hero-slide-${index + 1}`,
    mediaType: "image" as const,
    image: slide.image,
    video: "",
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
    secondaryImage: "/images/about-secondary.svg",
    pageEyebrow: "Sobre a Entre as Ilhas",
    pageTitle: "Navegando pelos paraísos da Bahia",
    pageDescription:
      "Conheça nossa proposta de turismo náutico exclusivo na Baía de Todos-os-Santos com conforto, segurança e roteiros personalizados.",
    cards: [
      {
        id: "card-1",
        icon: "🚤",
        title: "Embarcações Exclusivas",
        description:
          "Lanchas modernas equipadas com churrasqueira, som bluetooth, cabine e marinheiros credenciados pela Capitania dos Portos."
      },
      {
        id: "card-2",
        icon: "🌴",
        title: "Roteiros Sob Medida",
        description:
          "Passeios personalizados por Ilha dos Frades, Bom Jesus dos Passos, Ilha de Maré e enseadas de águas calmas e cristalinas."
      },
      {
        id: "card-3",
        icon: "⚓",
        title: "Hospitalidade Baiana",
        description:
          "Atendimento humanizado do planejamento ao desembarque, conectando nossos clientes às melhores mariscadas e tradições locais."
      }
    ],
    ctaTitle: "Quer planejar um dia no mar?",
    ctaDescription:
      "Fale conosco diretamente pelo WhatsApp e monte o roteiro perfeito para a sua família ou grupo de amigos.",
    ctaButtonText: "Falar com a Equipe"
  },
  routes: {
    sectionEyebrow: "Roteiros em destaque",
    sectionTitle: "Experiências Entre as Ilhas",
    sectionButtonText: "Ver passeios",
    pageEyebrow: "Experiências Náuticas",
    pageTitle: "Roteiros de Lancha & Passeios",
    pageDescription:
      "Descubra nossos passeios privativos e programados pela Baía de Todos-os-Santos. Embarcações seguras com marinheiro e estrutura completa.",
    ctaTitle: "Deseja um roteiro sob medida?",
    ctaDescription:
      "Personalizamos saídas para aniversários, ensaios fotográficos e passeios em família.",
    ctaButtonText: "Solicitar no WhatsApp",
    homeItems: routeItems.map((item, index) => ({
      id: `route-item-${index + 1}`,
      title: item.title,
      description: item.description,
      image: item.image,
      link: "/passeios"
    })),
    tours: tours.map((t) => ({ ...t })),
    bookingRoutes: JSON.parse(JSON.stringify(BOOKING_ROUTES))
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
  cta: {
    eyebrow: "Venha viver",
    title: "Entre as Ilhas!",
    subtitle:
      "Passeios privativos pelas águas mais mornas e cristalinas da Baía de Todos-os-Santos.",
    buttonText: "Planejar Passeio",
    buttonLink: "#inicio",
    showBoatTransition: true,
    boatImage: "/images/barco.png",
    mediaType: "image" as const,
    backgroundImage: "/images/routes-bg.svg",
    backgroundVideo: ""
  },
  contact: {
    pageEyebrow: "Fale Conosco",
    pageTitle: "Canais de Atendimento",
    pageDescription:
      "Entre em contato com a equipe Entre as Ilhas para tirar dúvidas, consultar disponibilidade de lanchas ou reservar o seu passeio.",
    whatsappCard: {
      badge: "Atendimento Rápido",
      title: "WhatsApp",
      description: "Converse diretamente com nossos consultores para orçamentos e reservas.",
      value: "+55 (71) 99251-7302",
      link: "https://wa.me/5571992517302?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20passeios%20de%20lancha%20da%20Entre%20as%20Ilhas."
    },
    instagramCard: {
      badge: "Rede Social Oficial",
      title: "Instagram",
      description: "Acompanhe stories diários, saídas de barco, marés e paisagens da Baía.",
      value: "@entreasilhas",
      link: "https://www.instagram.com/entreasilhas"
    },
    locationCard: {
      badge: "Base da Operação",
      title: "Baía de Todos-os-Santos",
      description:
        "Embarques programados nas principais marinas e pontos de apoio náutico de Salvador e região.",
      note: "Atendimento mediante reserva prévia."
    },
    email: "contato@entreasilhas.com.br",
    modalTitle: "Fale Conosco",
    modalSubtitle:
      "Preencha os campos abaixo e entraremos em contato o mais rápido possível."
  },
  footer: {
    title: "Vamos navegar",
    description:
      "Experiências náuticas, águas mornas e os melhores roteiros de lancha na Baía de Todos-os-Santos.",
    phoneFormatted: "+55 (71) 99251-7302",
    phoneLink: "https://wa.me/5571992517302",
    baseTitle: "Base da operação",
    baseLocation: "Baía de Todos-os-Santos, Bahia",
    baseSchedule: "Atendimento por reserva e planejamento prévio",
    baseEmail: "contato@entreasilhas.com.br",
    newsletterTitle: "Receber novidades",
    newsletterPlaceholder: "Seu melhor e-mail",
    newsletterButton: "Enviar",
    copyright: "Entre as Ilhas • 2026 • Todos os direitos reservados"
  },
  settings: {
    siteName: "Entre as Ilhas",
    whatsappNumber: "5571992517302",
    whatsappFormatted: "+55 (71) 99251-7302",
    whatsappDefaultMessage:
      "Olá! Gostaria de informações sobre os passeios de lancha da Entre as Ilhas.",
    instagramHandle: "@entreasilhas",
    instagramUrl: "https://www.instagram.com/entreasilhas",
    features: { ...defaultSiteFeatures },
    maintenance: {
      enabled: false,
      title: "Estamos Preparando Novas Experiências",
      subtitle:
        "Nosso novo portal está sendo finalizado com muito carinho para oferecer o melhor em passeios de lancha privativos, roteiros pelas ilhas e agendamento online na Baía de Todos-os-Santos.",
      estimatedReturn: "Previsão de retorno: em breve!",
      contactWhatsApp: "5571992517302",
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
