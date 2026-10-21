import type { TideLevelKey } from "@/lib/tide-engine";

export interface BookingRouteOption {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  stops: string[];
  itinerary: string[];
  highlights: string[];
  duration: string;
  recommendedFor: string;
  image: string;
  badge?: string;
  bestTides: TideLevelKey[];
  bestTidesLabel: string;
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
    id: "roteiro-1",
    slug: "roteiro-1",
    name: "Roteiro 1 - Ilha dos Frades & Bom Jesus dos Passos",
    tagline: "Loreto (09h-11:30h), Paramana, Praia do Marinheiro e Bom Jesus dos Passos",
    shortDescription:
      "Ilha dos Frades (Praia do Loreto e Paramana das 09h às 11:30h, Praia do Marinheiro) e Ilha de Bom Jesus dos Passos.",
    detailedDescription:
      "Navegue pelas enseadas mais abrigadas e charmosas da Baía de Todos-os-Santos. O roteiro inclui parada e banho de mar calmo na Praia do Loreto e Praia de Paramana (paradas exclusivas das 09h às 11:30h, com saída às 11:30h, sincronizadas com maré favorável), águas cristalinas na Praia do Marinheiro e desembarque contemplativo no vilarejo histórico de Bom Jesus dos Passos.",
    stops: [
      "Ilha dos Frades: Praia do Loreto (parada exclusiva das 09h às 11:30h)",
      "Ilha dos Frades: Praia de Paramana (parada exclusiva das 09h às 11:30h)",
      "Ilha dos Frades: Praia do Marinheiro",
      "Ilha de Bom Jesus dos Passos"
    ],
    itinerary: [
      "Embarque em Madre de Deus com brinde de boas-vindas",
      "Ilha dos Frades: Parada na Praia do Loreto (janela das 09h com saída às 11:30h)",
      "Ilha dos Frades: Parada na Praia de Paramana (janela das 09h com saída às 11:30h)",
      "Ilha dos Frades: Parada relaxante na Praia do Marinheiro",
      "Atracação em Bom Jesus dos Passos para almoço e visita histórica",
      "Navegação panorâmica de retorno pelas enseadas protegidas"
    ],
    highlights: [
      "Águas calmas e límpidas ideais para famílias e crianças",
      "Paradas matinais estratégicas no Loreto e Paramana (09h às 11:30h)",
      "Cais acolhedor e gastronomia típica em Bom Jesus dos Passos",
      "Excelente calado com maré intermediária ou cheia na janela matinal"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Famílias, casais e grupos buscando praias calmas, conforto e gastronomia",
    image: "/images/panoramas/ilha-dos-frades.jpg",
    badge: "Mais Procurado",
    bestTides: ["intermediaria_enchente", "cheia", "cheia_vazante"],
    bestTidesLabel: "Intermediária/enchente • Cheia • Cheia/vazante (janela 09h–11:30h)"
  },
  {
    id: "roteiro-2",
    slug: "roteiro-2",
    name: "Roteiro 2 - Ilha das Vacas & Ilha de Maria Guarda",
    tagline: "Praia Grande (maré cheia) ou Manguinho, Ponta do Navio, Sossego e Maria Guarda",
    shortDescription:
      "Ilha das Vacas (Praia Grande ou Manguinho, Praia da Ponta do Navio, Praia do Sossego) e Ilha de Maria Guarda.",
    detailedDescription:
      "Um dos refúgios mais exclusivos e preservados da Baía. Navegue contornando a Ilha das Vacas com paradas para banho na Praia Grande (região muito rasa que exige maré o mais cheia possível) ou na parada alternativa em Manguinho (mais acessível e segura na mesma ilha), visual cênico da Ponta do Navio e tranquilidade total na Praia do Sossego, além do encanto cultural da Ilha de Maria Guarda.",
    stops: [
      "Ilha das Vacas: Praia Grande (maré cheia por ser rasa) ou Manguinho (parada acessível)",
      "Ilha das Vacas: Praia da Ponta do Navio",
      "Ilha das Vacas: Praia do Sossego",
      "Ilha de Maria Guarda"
    ],
    itinerary: [
      "Saída de Madre de Deus em direção à Ilha das Vacas",
      "Primeira parada: Banho na Praia Grande (com maré cheia) ou Manguinho (com maré intermediária)",
      "Passagem cênica fotográfica pela Ponta do Navio",
      "Parada relaxante e mergulho na acolhedora Praia do Sossego",
      "Parada na tradicional Ilha de Maria Guarda para almoço ou petiscos",
      "Navegação suave de retorno sob a brisa da Baía"
    ],
    highlights: [
      "Natureza intocada e praias com baixa movimentação de barcos",
      "Sensação de ilha privativa com águas mornas",
      "Alternativa inteligente em Manguinho para conforto náutico em marés intermediárias",
      "Cultura pesqueira autêntica em Maria Guarda"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Quem quer fugir do óbvio, relaxar sem pressa e curtir enseadas reservadas",
    image: "/images/panoramas/cais-bom-jesus.jpg",
    badge: "Refúgio Exclusivo",
    bestTides: ["intermediaria_enchente", "cheia", "cheia_vazante"],
    bestTidesLabel: "Intermediária/enchente • Cheia • Cheia/vazante"
  },
  {
    id: "roteiro-3",
    slug: "roteiro-3",
    name: "Roteiro 3 - Ilha dos Frades & Piscinas Naturais",
    tagline: "Piscinas Naturais (09h-11:30h) ou Loreto, Guadalupe, Viração e Sugestão Náutica",
    shortDescription:
      "Ilha dos Frades: Piscinas Naturais de Paramana (09h às 11:30h) ou Praia do Loreto, Ponta de N. Sra. de Guadalupe, Praia da Viração e sugestão do marinheiro no retorno.",
    detailedDescription:
      "A experiência definitiva na maré baixa. Desça da lancha com a água nos joelhos nas piscinas naturais cristalinas de Paramana (parada exclusiva das 09h às 11:30h, exigindo maré o mais baixa possível; caso a maré matinal esteja cheia, a parada é adaptada para a Praia do Loreto), visite a célebre Ponta de Nossa Senhora de Guadalupe com selo Bandeira Azul, banhe-se na selvagem Praia da Viração e termine com uma parada surpresa sugerida pelo marinheiro no retorno.",
    stops: [
      "Ilha dos Frades: Piscinas Naturais de Paramana (09h às 11:30h, maré baixa) ou Praia do Loreto (caso maré alta)",
      "Ilha dos Frades: Ponta de Nossa Senhora de Guadalupe (Bandeira Azul)",
      "Ilha dos Frades: Praia da Viração",
      "Sugestão do marinheiro no retorno"
    ],
    itinerary: [
      "Embarque programado às 09h sincronizado com a maré matinal",
      "Piscinas Naturais de Paramana (09h às 11:30h com maré baixa) ou Praia do Loreto (se maré alta)",
      "Ponta de Nossa Senhora de Guadalupe: banho e mirante da igrejinha histórica",
      "Praia da Viração: enseada com mata atlântica preservada e mar translúcido",
      "Parada bônus selecionada pelo marinheiro no retorno ao pôr do sol"
    ],
    highlights: [
      "Piscinas naturais rasas perfeitas para fotos cinematográficas das 09h às 11:30h",
      "Praia com Certificação Internacional Bandeira Azul (Guadalupe)",
      "Mirante panorâmico de 360° da igrejinha de Guadalupe",
      "Flexibilidade e segurança com adaptação para o Loreto se a maré encher"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Amantes de fotos, snorkeling, piscinas naturais e praias paradisíacas",
    image: "/images/panoramas/coroa-do-frade.jpg",
    badge: "Piscinas Naturais",
    bestTides: ["baixa", "baixa_enchente", "intermediaria_vazante"],
    bestTidesLabel: "Baixa • Baixa/enchente • Intermediária/vazante (janela 09h–11:30h)"
  },
  {
    id: "roteiro-4",
    slug: "roteiro-4",
    name: "Roteiro 4 - Sugestão do Marinheiro",
    tagline: "As melhores paradas do dia selecionadas conforme as condições da maré",
    shortDescription:
      "Sugestão do marinheiro - Serão sugeridas as melhores paradas de acordo com as condições da maré no dia do passeio.",
    detailedDescription:
      "Roteiro 100% dinâmico e flexível. O marinheiro, conhecedor de cada segredo da Baía de Todos-os-Santos, avalia a altura exata da maré, vento e correntes para escolher as praias mais abrigadas, cristalinas e confortáveis para o seu grupo em tempo real.",
    stops: [
      "Sugestão personalizada do marinheiro",
      "Paradas dinâmicas selecionadas de acordo com as condições da maré",
      "Flexibilidade total alinhada diretamente no embarque"
    ],
    itinerary: [
      "Briefing rápido com o marinheiro na saída para alinhar preferências do grupo",
      "Navegação para os pontos com melhor condição hidrológica e água mais límpida do dia",
      "Paradas estratégicas de banho sem vento e sem ondulação",
      "Parada para almoço de acordo com o gosto dos passageiros (restaurante ou churrasco)",
      "Retorno com paradas contemplativas nos recantos mais bonitos da Baía"
    ],
    highlights: [
      "100% adaptável para garantir a melhor experiência em qualquer dia",
      "Paradas definidas pelo marinheiro conforme maré, correnteza e ventos",
      "Mais tranquilidade e menos tempo em praias com mar agitado",
      "Atendimento exclusivo e consultoria náutica em tempo real"
    ],
    duration: "09:00h às 16:00h (7 horas)",
    recommendedFor: "Quem deseja uma experiência fluida sem se preocupar com tábuas e horários de maré",
    image: "/images/panoramas/enseada-dos-frades.jpg",
    badge: "Personalizado",
    bestTides: [
      "cheia",
      "cheia_vazante",
      "intermediaria_vazante",
      "baixa",
      "baixa_enchente",
      "intermediaria_enchente"
    ],
    bestTidesLabel: "Todas as marés (adaptado pelo marinheiro em tempo real)"
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
