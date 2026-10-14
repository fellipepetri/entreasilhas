export type HotspotType = "navigation" | "info" | "tour" | "secret";

export interface HotspotInfoContent {
  title: string;
  category: string;
  description: string;
  curiosity?: string;
  history?: string;
  tips?: string;
  photoUrl?: string;
  badge?: string;
}

export interface HotspotTourContent {
  tourTitle: string;
  duration: string;
  boatType: string;
  capacity: string;
  itinerary: string[];
  includes: string[];
  priceInfo: string;
  whatsappMessage: string;
}

export interface HotspotSecretContent {
  secretId: string;
  name: string;
  scientificName?: string;
  category?: string;
  habitat?: string;
  icon: string;
  rarity: "Comum" | "Raro" | "Lendário";
  story: string;
  culinaryTradition?: string;
  ecologicalCuriosity?: string;
  foundMessage: string;
}

export interface PanoramaHotspot {
  id: string;
  type: HotspotType;
  pitch: number; // -90 (chão) a +90 (céu)
  yaw: number;   // -180 a +180
  title: string;
  shortDesc: string;
  targetSceneId?: string; // para type "navigation"
  infoContent?: HotspotInfoContent;
  tourContent?: HotspotTourContent;
  secretContent?: HotspotSecretContent;
}

export interface PanoramaScene {
  id: string;
  title: string;
  subtitle: string;
  locationName: string;
  image: string;
  previewThumb: string;
  initialView: {
    pitch: number;
    yaw: number;
    fov: number;
  };
  mapCoords: {
    x: number; // 0 a 100% no mini-mapa
    y: number; // 0 a 100% no mini-mapa
  };
  audioMood: "calm_waves" | "harbor_breeze" | "open_sea" | "golden_sunset";
  hotspots: PanoramaHotspot[];
}

export const PANORAMA_SCENES: PanoramaScene[] = [
  {
    id: "ilha-dos-frades",
    title: "Ilha dos Frades",
    subtitle: "Ponta de Nossa Senhora de Guadalupe — Mar cristalino e Bandeira Azul",
    locationName: "Ilha dos Frades, Baía de Todos-os-Santos",
    image: "/images/panoramas/ilha-dos-frades.jpg",
    previewThumb: "/images/panoramas/ilha-dos-frades.jpg",
    initialView: {
      pitch: 2,
      yaw: 15,
      fov: 75
    },
    mapCoords: {
      x: 62,
      y: 68
    },
    audioMood: "calm_waves",
    hotspots: [
      {
        id: "frades-info-guadalupe",
        type: "info",
        pitch: 12,
        yaw: 28,
        title: "Igreja de N. Sra. de Guadalupe",
        shortDesc: "Mirante histórico do século XVII com vista panorâmica da enseada",
        infoContent: {
          title: "Igreja de Nossa Senhora de Guadalupe",
          category: "Patrimônio Histórico & Mirante",
          badge: "Vista Panorâmica",
          description:
            "Erguida pelos padres jesuítas no século XVII, a igrejinha no topo da colina é um dos cartões-postais mais marcantes da Baía de Todos-os-Santos. A subida pela escadaria é recompensada por um visual inacreditável das águas calmas e verdes.",
          curiosity:
            "A praia da Ponta de Nossa Senhora ostenta o prestigiado selo internacional Bandeira Azul, reconhecendo rigorosos padrões de pureza das águas, segurança e conservação ambiental.",
          history:
            "A colina foi ponto estratégico de vigília contra invasões marítimas na época colonial, vigiando as rotas de acesso a Salvador.",
          tips: "Ideal para fotos no meio da manhã, quando a luz do sol destaca a transparência das piscinas naturais ao redor do píer.",
          photoUrl: "/images/panoramas/ilha-dos-frades.jpg"
        }
      },
      {
        id: "frades-tour-speedboat",
        type: "tour",
        pitch: -8,
        yaw: -32,
        title: "Passeio Privativo de Lancha",
        shortDesc: "Embarque exclusivo com parada gourmet e banho de mar nas enseadas",
        tourContent: {
          tourTitle: "Roteiro Ilhas Paradisíacas — Entre as Ilhas",
          duration: "6 a 7 horas de navegação com paradas",
          boatType: "Lancha Rápida Confort (29 a 36 pés)",
          capacity: "Até 12 passageiros com total conforto",
          itinerary: [
            "Saída de Bom Jesus dos Passos com embarque facilitado",
            "Navegação costeira contemplando a rica fauna e manguezais",
            "Parada na Ponta de Nossa Senhora (Ilha dos Frades) para banho e almoço típico",
            "Parada na Coroa do Frade ou Ilha de Maré para pôr do sol",
            "Retorno com navegação suave e brisa do entardecer"
          ],
          includes: [
            "Comandante marinheiro habilitado e experiente",
            "Combustível completo para todo o itinerário",
            "Geleira térmica com gelo filtrado para suas bebidas",
            "Som Bluetooth a bordo e coletes homologados pela Marinha",
            "Churrasqueira náutica a bordo (opcional sob consulta)"
          ],
          priceInfo: "Consulte valores personalizados de acordo com a data e tamanho do grupo.",
          whatsappMessage:
            "Olá Entre as Ilhas! Estava navegando pela Experiência 360° no site e adorei o ponto da Ilha dos Frades. Gostaria de informações sobre valores e disponibilidade de lancha para este roteiro!"
        }
      },
      {
        id: "frades-to-cais",
        type: "navigation",
        pitch: -4,
        yaw: 130,
        title: "Ir para o Cais de Bom Jesus",
        shortDesc: "Acesse o ponto náutico de partida e centro da ilha",
        targetSceneId: "cais-bom-jesus"
      },
      {
        id: "frades-to-coroa",
        type: "navigation",
        pitch: -3,
        yaw: -115,
        title: "Ir para a Coroa do Frade",
        shortDesc: "Explore o banco de areia e piscinas em mar aberto",
        targetSceneId: "coroa-do-frade"
      },
      {
        id: "secret-concha-peguari",
        type: "secret",
        pitch: -36,
        yaw: 42,
        title: "Concha de Peguari Nativo",
        shortDesc: "O clássico molusco das areias rasas e límpidas de Guadalupe!",
        secretContent: {
          secretId: "concha-peguari",
          name: "Concha de Peguari Nativo",
          scientificName: "Strombus pugilis / Lobatus raninus",
          category: "Concha • Molusco Gastrópode",
          habitat: "Bancos de areia e piscinas rasas da Ponta de Guadalupe",
          icon: "🐚",
          rarity: "Comum",
          story:
            "O peguari é uma das conchas marinhas mais emblemáticas da Baía de Todos-os-Santos. Encontrado nas águas mornas e areias limpas da Ilha dos Frades, esse molusco possui concha espiralada pesada e reluzente, exibindo tons alaranjados e rosados. Nas comunidades costeiras e vilarejos insulares, suas conchas são guardadas com carinho como amuletos de boas marés e proteção náutica.",
          culinaryTradition:
            "Na gastronomia típica do litoral baiano, o peguari é uma iguaria tradicionalíssima: servido cozido na própria concha com vinagrete e pimenta-de-cheiro fresca, ou como 'catado de peguari' para acompanhar um bom banho de mar.",
          ecologicalCuriosity:
            "Sensível à poluição e à turbidez da água, a ocorrência abundante do peguari na Ponta de Nossa Senhora é um indicador natural da pureza e equilíbrio das águas, que ostentam a prestigiada Bandeira Azul.",
          foundMessage: "Você descobriu a Concha de Peguari Nativo!"
        }
      }
    ]
  },
  {
    id: "cais-bom-jesus",
    title: "Cais Náutico de Bom Jesus dos Passos",
    subtitle: "Orla dos Pescadores e Marina — O coração das travessias náuticas",
    locationName: "Bom Jesus dos Passos, Baía de Todos-os-Santos",
    image: "/images/panoramas/cais-bom-jesus.jpg",
    previewThumb: "/images/panoramas/cais-bom-jesus.jpg",
    initialView: {
      pitch: 0,
      yaw: -45,
      fov: 75
    },
    mapCoords: {
      x: 38,
      y: 42
    },
    audioMood: "harbor_breeze",
    hotspots: [
      {
        id: "cais-info-cultura",
        type: "info",
        pitch: 6,
        yaw: -88,
        title: "Tradição Náutica & Cais Histórico",
        shortDesc: "Ponto onde a vida insular pulsa e as lanchas ganham o mar",
        infoContent: {
          title: "O Ponto de Encontro dos Navegantes",
          category: "Vida Comunitária & Náutica",
          badge: "Tradição Marítima",
          description:
            "Bom Jesus dos Passos é famosa pela hospitalidade calorosa, ritmo tranquilo e vocação centenária para carpintaria naval e turismo náutico. É aqui que os passeios da Entre as Ilhas começam com toda a comodidade.",
          curiosity:
            "A ilha é praticamente livre de carros convencionais, proporcionando passeios a pé silenciosos entre ruelas floridas, praças charmosas e restaurantes de frutos do mar frescos.",
          tips: "Aproveite a chegada no cais para experimentar o pastel de siri artesanal ou uma água de coco gelada nas barracas tradicionais.",
          photoUrl: "/images/panoramas/cais-bom-jesus.jpg"
        }
      },
      {
        id: "cais-tour-exclusivo",
        type: "tour",
        pitch: -12,
        yaw: 15,
        title: "Embarque Entre as Ilhas",
        shortDesc: "Seu ponto de partida oficial para explorar a Baía com conforto VIP",
        tourContent: {
          tourTitle: "Travessia Sob Medida Entre as Ilhas",
          duration: "Passeios de meio período (4h) ou dia inteiro (7h)",
          boatType: "Embarcações homologadas com suporte náutico completo",
          capacity: "Grupos de 4 a 15 pessoas",
          itinerary: [
            "Recepção personalizada no cais de Bom Jesus dos Passos",
            "Acolhimento com briefing náutico e acomodação de bagagens",
            "Roteiro flexível passando por praias secretas, enseadas e ilhotas vizinhas",
            "Tempo livre para natação com flutuadores náuticos e snorkel",
            "Desembarque com tranquilidade no mesmo ponto ou cais conveniado"
          ],
          includes: [
            "Marinheiro credenciado com alto conhecimento da região",
            "Combustível e taxas de ancoragem",
            "Cooler espaçoso abastecido com gelo",
            "Caixa de som náutica potente integrada"
          ],
          priceInfo: "Valores promocionais para reservas antecipadas em dias de semana e finais de semana.",
          whatsappMessage:
            "Olá! Estava no tour 360° no Cais de Bom Jesus dos Passos e quero reservar uma saída exclusiva de lancha com a Entre as Ilhas. Pode me enviar os detalhes?"
        }
      },
      {
        id: "cais-to-frades",
        type: "navigation",
        pitch: -2,
        yaw: 65,
        title: "Navegar para a Ilha dos Frades",
        shortDesc: "Siga viagem para as águas azuis da Ponta de Guadalupe",
        targetSceneId: "ilha-dos-frades"
      },
      {
        id: "cais-to-sunset",
        type: "navigation",
        pitch: 3,
        yaw: -170,
        title: "Contemplar o Pôr do Sol na Enseada",
        shortDesc: "Veja as cores do entardecer sobre as águas calmas",
        targetSceneId: "por-do-sol-enseada"
      },
      {
        id: "secret-caranguejo-uca",
        type: "secret",
        pitch: -28,
        yaw: -60,
        title: "Caranguejo-Uçá dos Manguezais",
        shortDesc: "O clássico habitante dos manguezais de Bom Jesus dos Passos!",
        secretContent: {
          secretId: "caranguejo-uca",
          name: "Caranguejo-Uçá de Bom Jesus",
          scientificName: "Ucides cordatus",
          category: "Crustáceo • Guardião dos Mangues",
          habitat: "Manguezais salobros e raízes de maré de Bom Jesus dos Passos",
          icon: "🦀",
          rarity: "Raro",
          story:
            "O caranguejo-uçá é o verdadeiro guardião dos manguezais que cercam a ilha de Bom Jesus dos Passos. Escavando galerias de até dois metros de profundidade na lama salobra, ele se alimenta de folhas de mangue e desempenha um papel ecológico insubstituível na reciclagem de nutrientes e oxigenação do solo marinho.",
          culinaryTradition:
            "A mariscagem do caranguejo é tradição passada de geração em geração. O caranguejo cozido com água, sal, tomate, pimentão e muito coentro — servido inteiro com pirão e vinagrete — é a atração principal dos fins de semana nos quiosques e restaurantes da orla de Bom Jesus.",
          ecologicalCuriosity:
            "Nas luas cheias de verão, ocorre o fenômeno da 'andada', quando os caranguejos saem das tocas para o acasalamento. A comunidade local respeita com afinco os períodos de defeso para assegurar a renovação contínua da espécie.",
          foundMessage: "Você encontrou o Caranguejo-Uçá dos Manguezais!"
        }
      }
    ]
  },
  {
    id: "coroa-do-frade",
    title: "Coroa do Frade & Piscinas da Baía",
    subtitle: "Banco de areia e águas rasas azul-turquesa no meio do oceano",
    locationName: "Banco de Areia, Baía de Todos-os-Santos",
    image: "/images/panoramas/coroa-do-frade.jpg",
    previewThumb: "/images/panoramas/coroa-do-frade.jpg",
    initialView: {
      pitch: -5,
      yaw: 110,
      fov: 75
    },
    mapCoords: {
      x: 75,
      y: 50
    },
    audioMood: "open_sea",
    hotspots: [
      {
        id: "coroa-info-banco",
        type: "info",
        pitch: 8,
        yaw: 85,
        title: "O Banco de Areia Secreto",
        shortDesc: "Fenômeno natural revelado pelas tábuas das marés",
        infoContent: {
          title: "Piscinas Naturais da Coroa do Frade",
          category: "Fenômeno Natural & Banho de Mar",
          badge: "Águas Cristalinas",
          description:
            "Na maré baixa, um banco de areia fina e dourada emerge em pleno mar aberto, formando lagoas calmas e rasas com água morna e transparente. É uma das paradas mais disputadas e exclusivas de toda a Baía de Todos-os-Santos.",
          curiosity:
            "A profundidade da água aqui pode ir do tornozelo à cintura na maré seca, criando um ambiente perfeito para brindar com taças à mão dentro da água!",
          history:
            "Conhecido pelos nativos há gerações, o banco era usado como ponto de descanso de pescadores que aguardavam a virada da maré.",
          tips: "Nossos comandantes monitoram diariamente as cartas de maré para programar a chegada no momento exato do ápice da maré baixa.",
          photoUrl: "/images/panoramas/coroa-do-frade.jpg"
        }
      },
      {
        id: "coroa-tour-sunset",
        type: "tour",
        pitch: -15,
        yaw: 160,
        title: "Experiência Open Sea VIP",
        shortDesc: "Ancoragem com flutuadores, música de alta qualidade e brinde no mar",
        tourContent: {
          tourTitle: "Roteiro Piscinas Naturais & Banco de Areia",
          duration: "5 a 6 horas de pura imersão aquática",
          boatType: "Lancha veloz com solário e escada de popa facilitada",
          capacity: "De 2 a 12 pessoas",
          itinerary: [
            "Saída matinal com tempo firme e mar tranquilo",
            "Ancoragem estratégica nas piscinas naturais com apoio de tapete flutuante",
            "Tempo livre prolongado para mergulho livre, stand-up paddle e relaxamento",
            "Sessão de fotos aéreas e subaquáticas para registrar o grupo",
            "Passagem suave pela orla das ilhas no retorno"
          ],
          includes: [
            "Tapete flutuante gigante e espaguetes de natação",
            "Equipamento de mergulho (máscaras e snorkels)",
            "Som Bluetooth marinizado de alta definição",
            "Serviço cortês do comandante Entre as Ilhas"
          ],
          priceInfo: "Valores sob medida com opções especiais para datas comemorativas e aniversários.",
          whatsappMessage:
            "Olá pessoal do Entre as Ilhas! Vi o visual 360° do banco de areia da Coroa do Frade e fiquei encantado(a). Gostaria de saber os horários das marés e valores para um passeio privativo!"
        }
      },
      {
        id: "coroa-to-frades",
        type: "navigation",
        pitch: -2,
        yaw: -45,
        title: "Voltar para Ilha dos Frades",
        shortDesc: "Retorne à enseada arborizada de Guadalupe",
        targetSceneId: "ilha-dos-frades"
      },
      {
        id: "coroa-to-sunset",
        type: "navigation",
        pitch: 2,
        yaw: -140,
        title: "Assistir ao Pôr do Sol",
        shortDesc: "Aprecie a hora dourada sobre o mar",
        targetSceneId: "por-do-sol-enseada"
      },
      {
        id: "secret-siri-azul",
        type: "secret",
        pitch: -18,
        yaw: -95,
        title: "Siri-Azul das Piscinas Rasas",
        shortDesc: "O ágil crustáceo nadador das águas cristalinas do banco de areia!",
        secretContent: {
          secretId: "siri-azul",
          name: "Siri-Azul da Coroa do Frade",
          scientificName: "Callinectes sapidus / Callinectes danae",
          category: "Crustáceo • Nadador Ágil",
          habitat: "Piscinas naturais rasas e bancos de areia da Coroa do Frade",
          icon: "🦀",
          rarity: "Raro",
          story:
            "Diferente dos caranguejos que caminham pelo solo, o siri possui o último par de patas traseiras em formato de remo achatado, o que o torna um nadador formidável. Ele adora circular pelas águas transparentes e mornas da Coroa do Frade durante a maré baixa em busca de pequenos mariscos.",
          culinaryTradition:
            "A carne desfiada e suave do siri é estrela absoluta da culinária da Baía: dá origem à cobiçada casquinha de siri temperada com azeite de dendê e leite de coco, e ao famoso pastel artesanal de siri que faz sucesso garantido nos passeios de lancha.",
          ecologicalCuriosity:
            "Com sua coloração azulada camuflada no fundo arenoso, o siri é capaz de se enterrar na areia em menos de três segundos ao avistar qualquer movimento, deixando apenas os olhos salientes à espreita.",
          foundMessage: "Você avistou o Siri-Azul das Piscinas Naturais!"
        }
      }
    ]
  },
  {
    id: "por-do-sol-enseada",
    title: "Pôr do Sol na Enseada",
    subtitle: "A hora dourada na Baía de Todos-os-Santos — Cores inesquecíveis",
    locationName: "Enseada de Bom Jesus dos Passos & Ilha dos Frades",
    image: "/images/panoramas/por-do-sol-enseada.jpg",
    previewThumb: "/images/panoramas/por-do-sol-enseada.jpg",
    initialView: {
      pitch: 4,
      yaw: 15,
      fov: 75
    },
    mapCoords: {
      x: 48,
      y: 75
    },
    audioMood: "golden_sunset",
    hotspots: [
      {
        id: "sunset-info-crepusculo",
        type: "info",
        pitch: 8,
        yaw: -15,
        title: "A Magia da Hora Dourada",
        shortDesc: "O espetáculo do poente refletido nas águas calmas da baía",
        infoContent: {
          title: "O Pôr do Sol Mais Bonito do Litoral Baiano",
          category: "Experiência Contemplativa",
          badge: "Momento Mágico",
          description:
            "A Baía de Todos-os-Santos possui uma geografia privilegiada voltada para o oeste. No fim da tarde, o céu se tinge em tons de âmbar, rosa e dourado, criando um reflexo espelhado impressionante na água sem ondas.",
          curiosity:
            "Nossos clientes frequentemente escolhem esse momento para pedidos de casamento, celebrações de aniversário ou simplesmente para fechar o dia com um brinde inesquecível ao som da sua trilha sonora favorita.",
          history:
            "Os povos indígenas e navegantes antigos usavam as cores do crepúsculo na Baía para prever as condições do vento e das marés para a alvorada seguinte.",
          tips: "Mantenha a câmera do celular pronta: os 20 minutos que antecedem o sumiço do sol são os mais radiantes para fotos de silhueta e retratos dourados.",
          photoUrl: "/images/panoramas/por-do-sol-enseada.jpg"
        }
      },
      {
        id: "sunset-tour-sunset",
        type: "tour",
        pitch: -10,
        yaw: 45,
        title: "Passeio Sunset Entre as Ilhas",
        shortDesc: "Navegação crepuscular com parada estratégica para assistir ao sol se pôr",
        tourContent: {
          tourTitle: "Roteiro Sunset Premium — Entre as Ilhas",
          duration: "3 horas e meia (embarque às 14h30)",
          boatType: "Lancha com iluminação de cortesia e cockpit acolhedor",
          capacity: "Ideal para casais, famílias ou pequenos grupos de amigos (até 10 pessoas)",
          itinerary: [
            "Embarque à tarde com sol mais brando e clima ameno",
            "Parada rápida para último mergulho refrescante na enseada",
            "Ancoragem em ponto panorâmico com visão desobstruída do poente",
            "Momento do brinde ao pôr do sol com taças e fotos",
            "Navegação tranquila de volta com o início das luzes da orla"
          ],
          includes: [
            "Taças de acrílico premium para espumante ou drinks",
            "Cooler com gelo mineral",
            "Iluminação náutica suave para o entardecer",
            "Playlist náutica suave ou conexão via seu próprio smartphone"
          ],
          priceInfo: "Consulte disponibilidade com antecedência, vagas limitadas para o pôr do sol nos fins de semana.",
          whatsappMessage:
            "Olá! Adorei a vista 360° do pôr do sol na enseada. Gostaria de agendar o Roteiro Sunset com a Entre as Ilhas. Como podemos fechar a data?"
        }
      },
      {
        id: "sunset-to-cais",
        type: "navigation",
        pitch: -4,
        yaw: 165,
        title: "Retornar ao Cais",
        shortDesc: "Voltar para o cais de Bom Jesus dos Passos",
        targetSceneId: "cais-bom-jesus"
      },
      {
        id: "sunset-to-frades",
        type: "navigation",
        pitch: -2,
        yaw: -85,
        title: "Ir para a Ilha dos Frades",
        shortDesc: "Conhecer a Ponta de Guadalupe sob o sol pleno",
        targetSceneId: "ilha-dos-frades"
      },
      {
        id: "secret-lambreta-baiana",
        type: "secret",
        pitch: -32,
        yaw: 2,
        title: "Lambreta Dourada das Enseadas",
        shortDesc: "O molusco bivalve mais celebrado da culinária marítima baiana!",
        secretContent: {
          secretId: "lambreta-baiana",
          name: "Lambreta Baiana das Enseadas",
          scientificName: "Lucina pectinata",
          category: "Molusco Bivalve • Tradição da Baía",
          habitat: "Leito arenoso e enseadas calmas de Bom Jesus dos Passos",
          icon: "🦪",
          rarity: "Lendário",
          story:
            "Nenhum fruto do mar é mais reverenciado na Bahia do que a lambreta! Este molusco bivalve de conchas circulares e estrias marcadas habita o leito das enseadas abrigadas entre Bom Jesus dos Passos e as ilhas vizinhas, onde a água é mansa e limpa.",
          culinaryTradition:
            "Servida fervida na própria concha com alho, azeite, cebola e folhas frescas de coentro, o costume baiano manda apreciar a carne suculenta e tomar o 'caldinho de lambreta' direto na concha como um néctar quente, saboroso e reconfortante.",
          ecologicalCuriosity:
            "A cata da lambreta é realizada artesanalmente pelas marisqueiras locais, que tateiam o fundo arenoso com os pés descalços durante a maré vazante — um patrimônio vivo da identidade cultural e da economia solidária de Bom Jesus dos Passos.",
          foundMessage: "Você descobriu a Lambreta Dourada das Enseadas!"
        }
      }
    ]
  }
];

export const TOTAL_SECRETS_COUNT = 4;

export interface RegionalSecretCatalogItem {
  id: string;
  name: string;
  scientificName: string;
  icon: string;
  location: string;
  category: string;
}

export const REGIONAL_SECRETS_CATALOG: RegionalSecretCatalogItem[] = [
  {
    id: "concha-peguari",
    name: "Concha de Peguari",
    scientificName: "Strombus pugilis",
    icon: "🐚",
    location: "Ilha dos Frades",
    category: "Concha / Molusco"
  },
  {
    id: "caranguejo-uca",
    name: "Caranguejo-Uçá",
    scientificName: "Ucides cordatus",
    icon: "🦀",
    location: "Bom Jesus dos Passos",
    category: "Crustáceo dos Mangues"
  },
  {
    id: "siri-azul",
    name: "Siri-Azul",
    scientificName: "Callinectes sapidus",
    icon: "🦀",
    location: "Coroa do Frade",
    category: "Crustáceo Nadador"
  },
  {
    id: "lambreta-baiana",
    name: "Lambreta Baiana",
    scientificName: "Lucina pectinata",
    icon: "🦪",
    location: "Enseada da Baía",
    category: "Molusco Bivalve"
  }
];
