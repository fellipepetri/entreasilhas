export interface BookingRouteOption {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  itinerary: string[];
  highlights: string[];
  duration: string;
  recommendedFor: string;
  image: string;
  badge?: string;
}

export interface LunchPreferenceOption {
  id: "restaurante" | "churrasqueira" | "proprio";
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tag: string;
}

export interface PaymentMethodOption {
  id: "pix" | "cartao" | "whatsapp";
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
  details: string[];
}

export const BOOKING_ROUTES: BookingRouteOption[] = [
  {
    id: "ilha-dos-frades-guadalupe",
    slug: "ilha-dos-frades-guadalupe",
    name: "Ilha dos Frades & Guadalupe",
    tagline: "Águas cristalinas, praias paradisíacas e culinária costeira",
    shortDescription:
      "A praia com selo internacional Bandeira Azul, águas calmas e mornas, e a charmosa Igreja de Nossa Senhora de Guadalupe.",
    detailedDescription:
      "Navegue pelo cartão-postal mais cobiçado da Baía de Todos-os-Santos. O roteiro inclui parada no ancoradouro de Ponta de Guadalupe, visita à histórica igrejinha no topo da colina com vista panorâmica de 360°, banho de mar em águas transparentes e parada para almoço à beira-mar.",
    itinerary: [
      "Embarque com brinde de boas-vindas",
      "Navegação cênica pela Baía de Todos-os-Santos",
      "Parada na Ponta de Nossa Senhora de Guadalupe (Ilha dos Frades)",
      "Tempo livre para banho de mar e caminhada até a igrejinha",
      "Parada para almoço (restaurante local ou churrasco a bordo)",
      "Banho relaxante em enseada abrigada",
      "Retorno suave apreciando a brisa da Baía"
    ],
    highlights: [
      "Praia com Certificação Internacional Bandeira Azul",
      "Mar calmo, ideal para todas as idades",
      "Mirante histórico de Guadalupe",
      "Restaurantes de culinária baiana de frutos do mar"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Famílias, casais e grupos buscando tranquilidade e cenários paradisíacos",
    image: "/images/panoramas/ilha-dos-frades.jpg",
    badge: "Mais Procurado"
  },
  {
    id: "bom-jesus-dos-passos",
    slug: "bom-jesus-dos-passos",
    name: "Bom Jesus dos Passos & Histórico",
    tagline: "O aconchego das ilhas tradicionais e enseadas como piscina",
    shortDescription:
      "Charme de vila de pescadores, casarios coloridos, águas calmas sem ondas e hospitalidade acolhedora.",
    detailedDescription:
      "Um dos refúgios mais autênticos e preservados da Bahia. Navegue pelas águas abrigadas ao redor de Bom Jesus dos Passos, ancore próximo ao cais histórico e aprecie a tranquilidade de um mar que parece uma imensa piscina natural, perfeito para boiar e relaxar.",
    itinerary: [
      "Embarque e saída da marina",
      "Navegação pelas enseadas calmas entre as ilhas",
      "Aproximação do cais acolhedor de Bom Jesus dos Passos",
      "Banho de mar prolongado em águas mornas e sem correnteza",
      "Almoço com mariscada fresca típica ou serviço a bordo",
      "Visita contemplativa ao vilarejo histórico",
      "Navegação de retorno relaxante"
    ],
    highlights: [
      "Mar com água morna e sem ondas (sensação de piscina)",
      "Autenticidade cultural e gastronômica",
      "Cais fotográfico e acolhedor",
      "Excelente para crianças e idosos"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Quem busca paz, gastronomia de raiz e banho de mar sem pressa",
    image: "/images/panoramas/cais-bom-jesus.jpg",
    badge: "Autêntico & Calmo"
  },
  {
    id: "coroa-do-frade-bancos-de-areia",
    slug: "coroa-do-frade-bancos-de-areia",
    name: "Coroa do Frade & Bancos de Areia",
    tagline: "Piscina natural no meio do mar na maré baixa",
    shortDescription:
      "Bancos de areia clara que emergem no meio da Baía, criando piscinas naturais mornas e rasas.",
    detailedDescription:
      "Uma das experiências mais exclusivas e mágicas da navegação náutica. Na maré baixa, a Coroa do Frade revela um banco de areia dourada cercado por mar límpido. Você desce da lancha com a água nos joelhos no meio da Baía de Todos-os-Santos para um brinde inesquecível.",
    itinerary: [
      "Embarque programado sincronizado com a tábua de marés",
      "Travessia em direção ao centro da Baía",
      "Chegada à Coroa do Frade no pico da maré baixa",
      "Descida no banco de areia para fotos, drinques e banho",
      "Almoço a bordo com churrasqueira ou restaurante vizinho",
      "Navegação pelas ilhotas adjacentes",
      "Encerramento com luz dourada da tarde"
    ],
    highlights: [
      "Banco de areia no meio do oceano",
      "Piscina natural cristalina e rasa",
      "Fotos aéreas e enquadramentos espetaculares",
      "Experiência náutica de alto impacto visual"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Grupos de amigos, celebrações e amantes de fotos e cenários cinematográficos",
    image: "/images/panoramas/coroa-do-frade.jpg",
    badge: "Exclusivo"
  },
  {
    id: "volta-completa-nas-ilhas",
    slug: "volta-completa-nas-ilhas",
    name: "Volta Completa nas Ilhas (Day Use)",
    tagline: "A grande expedição pelos melhores pontos da Baía em um só dia",
    shortDescription:
      "Circuito amplo unindo Ilha dos Frades, Bom Jesus dos Passos, bancos de areia e enseadas secretas.",
    detailedDescription:
      "O roteiro definitivo para quem quer vivenciar o melhor da Baía de Todos-os-Santos de ponta a ponta. Com flexibilidade de paradas para o seu grupo, alternando entre banhos de mar, mirantes históricos e almoço especial, aproveitando cada minuto a bordo com conforto total.",
    itinerary: [
      "Saída matutina com roteiro panorâmico completo",
      "Primeira parada: Banho matinal em enseada deserta",
      "Segunda parada: Ponta de Guadalupe (Ilha dos Frades)",
      "Terceira parada: Cais e gastronomia de Bom Jesus dos Passos",
      "Quarta parada: Banco de areia ou Coroa do Frade",
      "Tempo estendido para churrasco ou degustação a bordo",
      "Retorno com navegação panorâmica ao final da tarde"
    ],
    highlights: [
      "Visita aos principais destinos náuticos da região",
      "Roteiro flexível ajustado com o marinheiro",
      "Combinação de cultura, natureza e sofisticação",
      "Tempo máximo de aproveitamento da embarcação"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Celebrações especiais, aniversários e quem quer conhecer tudo em um dia épico",
    image: "/images/panoramas/por-do-sol-enseada.jpg",
    badge: "Experiência Completa"
  }
];

export const LUNCH_PREFERENCES: LunchPreferenceOption[] = [
  {
    id: "restaurante",
    title: "Almoço em Restaurante nas Ilhas",
    subtitle: "Parada em restaurantes tradicionais à beira-mar",
    description:
      "A lancha atraca em píer ou poita de restaurantes renomados (como Restaurante da Preta na Ilha dos Frades, ou restaurantes típicos em Bom Jesus dos Passos) para você saborear mariscadas, moquecas e peixes frescos.",
    icon: "🍽️",
    tag: "Recomendado"
  },
  {
    id: "churrasqueira",
    title: "Churrasqueira a Bordo da Lancha",
    subtitle: "Churrasco no mar enquanto você relaxa na água",
    description:
      "Utilize a churrasqueira inox da própria embarcação! Você pode levar suas carnes, queijo coalho e acompanhamentos favoritos, e o marinheiro auxilia no preparo enquanto a lancha fica ancorada em enseada calma.",
    icon: "🥩",
    tag: "Estrutura Inclusa"
  },
  {
    id: "proprio",
    title: "Lanches & Petiscos Próprios",
    subtitle: "Praticidade com cooler e gelo à vontade",
    description:
      "Traga seus próprios petiscos, sanduíches, frutas e bebidas. Disponibilizamos cooler térmico de grande capacidade abastecido com gelo mineral para manter tudo na temperatura ideal durante todo o dia.",
    icon: "🧺",
    tag: "Econômico & Flexível"
  }
];

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "pix",
    title: "PIX Instantâneo (Sinal 50% + Saldo no Embarque)",
    subtitle: "Método mais rápido e preferido pelos clientes",
    description:
      "Garanta a data e a lancha reservada imediatamente pagando 50% do valor do charter via PIX. Os 50% restantes são quitados com tranquilidade no dia do passeio, antes do embarque.",
    badge: "Mais Utilizado",
    icon: "⚡",
    details: [
      "Confirmação instantânea da lancha na data escolhida",
      "Emissão de recibo de reserva oficial em instantes",
      "Restante de 50% pago apenas no dia do embarque (via PIX ou Cartão)"
    ]
  },
  {
    id: "cartao",
    title: "Cartão de Crédito (Parcelado em até 12x)",
    subtitle: "Segurança e flexibilidade de parcelamento",
    description:
      "Pague a sua reserva no cartão de crédito via link de pagamento seguro, com possibilidade de parcelamento em até 12 vezes para facilitar o planejamento do grupo.",
    badge: "Até 12x",
    icon: "💳",
    details: [
      "Link de pagamento seguro gerado com antifraude",
      "Parcelamento flexível para dividir com o grupo",
      "Confirmação automática da reserva"
    ]
  },
  {
    id: "whatsapp",
    title: "Reserva Assistida com a Equipe no WhatsApp",
    subtitle: "Atendimento consultivo e personalização direta",
    description:
      "Envie todos os dados preenchidos diretamente para o WhatsApp oficial da agência. Um consultor náutico valida as condições de maré, confirma a melhor lancha e gera o contrato oficial de afretamento.",
    badge: "Consultoria Direta",
    icon: "💬",
    details: [
      "Validação das condições climáticas e marés por especialista",
      "Tire dúvidas sobre bebidas, crianças e necessidades especiais",
      "Contrato oficial enviado com um clique para assinatura digital"
    ]
  }
];

export const INCLUDED_AMENITIES = [
  { title: "Marinheiro Habilitado", desc: "Profissional credenciado pela Capitania dos Portos", icon: "👨‍✈️" },
  { title: "Combustível Incluso", desc: "Todo o consumo do roteiro já está coberto", icon: "⛽" },
  { title: "Cooler Térmico com Gelo", desc: "Gelo mineral à vontade para bebidas e petiscos", icon: "🧊" },
  { title: "Churrasqueira a Bordo", desc: "Estrutura pronta para churrasco nas paradas de banho", icon: "🔥" },
  { title: "Som Bluetooth Náutico", desc: "Conecte sua playlist durante a navegação", icon: "🎵" },
  { title: "Equipamentos de Segurança", desc: "Coletes salva-vidas homologados e boias", icon: "🛟" }
];
