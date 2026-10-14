export interface InstagramPost {
  id: string;
  image: string;
  videoUrl?: string;
  caption: string;
  permalink: string;
  likes: number;
  comments: number;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  date: string;
  location: string;
}

export interface InstagramProfile {
  username: string;
  name: string;
  profileUrl: string;
  avatarUrl: string;
  followers: string;
  followersCount: number;
  followingCount: number;
  postsCount: string;
  bio: string;
  location: string;
}

export const INSTAGRAM_PROFILE: InstagramProfile = {
  username: "entreasilhas",
  name: "E N T R E   A S   I L H A S",
  profileUrl: "https://www.instagram.com/entreasilhas",
  avatarUrl: "/images/logoeai.png",
  followers: "108 mil",
  followersCount: 108000,
  followingCount: 105,
  postsCount: "2.500+",
  bio: "Experiências e turismo náutico na Baía de Todos-os-Santos • Passeios exclusivos de lancha, ilhas paradisíacas e roteiros sob medida.",
  location: "Salvador / Baía de Todos-os-Santos, BA"
};

export const CURATED_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "post-1",
    image: "/images/panoramas/ilha-dos-frades.jpg",
    caption:
      "Águas transparentes e calmas na Ponta de Nossa Senhora de Guadalupe, Ilha dos Frades. Um paraíso preservado bem no coração da Baía de Todos-os-Santos! 🌴⛵ Quem vem navegar com a gente? #entreasilhas #ilhadosfrades #salvador #bahia #turismonautico",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 2180,
    comments: 114,
    mediaType: "CAROUSEL_ALBUM",
    date: "Há 1 dia",
    location: "Ilha dos Frades, Bahia"
  },
  {
    id: "post-2",
    image: "/images/panoramas/cais-bom-jesus.jpg",
    caption:
      "A tranquilidade histórica e as cores de Bom Jesus dos Passos. O cais acolhedor, a Igreja dos Passos e o mar que parece uma piscina. Viva essa experiência com o Entre as Ilhas! 🏛️⚓🌊 #bomjesusospassos #entreasilhas #ilhasdabahia #paraiso",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 1940,
    comments: 87,
    mediaType: "IMAGE",
    date: "Há 3 dias",
    location: "Bom Jesus dos Passos, BA"
  },
  {
    id: "post-3",
    image: "/images/panoramas/coroa-do-frade.jpg",
    caption:
      "Quando a maré baixa na Coroa do Frade, o mar revela essa incrível piscina natural no meio da Baía. Água cristalina e morna na medida certa! 🐚✨ Venha viver isso a bordo de nossas lanchas. #coroadofrade #baiadetodosossantos #passeiodelancha #mar",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 3410,
    comments: 172,
    mediaType: "VIDEO",
    date: "Há 4 dias",
    location: "Coroa do Frade, Baía de Todos-os-Santos"
  },
  {
    id: "post-4",
    image: "/images/panoramas/por-do-sol-enseada.jpg",
    caption:
      "O entardecer mais bonito do Brasil acontece nas enseadas da nossa Baía. Céu dourado, brisa suave e brinde a bordo. Momentos que ficam guardados pra sempre! 🌅🚤🥂 #pordosol #sunsetbahia #lanchas #entreasilhas #verao",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 2890,
    comments: 135,
    mediaType: "CAROUSEL_ALBUM",
    date: "Há 6 dias",
    location: "Enseada da Baía, Salvador - BA"
  },
  {
    id: "post-5",
    image: "/images/panoramas/ilha-dos-frades.jpg",
    caption:
      "Roteiro exclusivo para recarregar as energias: paradas estratégicas para banho, mergulho livre e contemplação pelas ilhas mais bonitas da região. Já montou seu grupo pro fim de semana? 🤿🏝️ #nordeste #turismo #passeiodebarco #feriasnabahia",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 1750,
    comments: 68,
    mediaType: "IMAGE",
    date: "Há 1 semana",
    location: "Ilhas da Baía de Todos-os-Santos"
  },
  {
    id: "post-6",
    image: "/images/panoramas/cais-bom-jesus.jpg",
    caption:
      "Gastronomia náutica, mariscos frescos e a hospitalidade sem igual do povo baiano. O turismo náutico com respeito às tradições e à natureza local! 🍽️🦀💛 #gastronomianautica #mariscada #culturabaiana #entreasilhas",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 2310,
    comments: 96,
    mediaType: "CAROUSEL_ALBUM",
    date: "Há 1 semana",
    location: "Bom Jesus dos Passos, BA"
  },
  {
    id: "post-7",
    image: "/images/panoramas/por-do-sol-enseada.jpg",
    caption:
      "Entre o azul do mar e a calmaria que só a Bahia sabe entregar... Navegue com quem entende e cuida de cada detalhe da sua experiência náutica. 🌊🚤 #baiadetodosossantos #entreasilhas #lanchas #passeios",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 1890,
    comments: 74,
    mediaType: "VIDEO",
    date: "Há 1 semana",
    location: "Baía de Todos-os-Santos, BA"
  },
  {
    id: "post-8",
    image: "/images/panoramas/ilha-dos-frades.jpg",
    caption:
      "Gratidão por cada saída de barco e por cada sorriso de quem vive a Baía com a gente! 🙏🏽🌴 #baiadetodosossantos #entreasilhas #salvador #bahia #turismobahia",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 2450,
    comments: 112,
    mediaType: "VIDEO",
    date: "Há 2 semanas",
    location: "Ilha dos Frades, Bahia"
  },
  {
    id: "post-9",
    image: "/images/panoramas/cais-bom-jesus.jpg",
    caption:
      "Chama quem tá te devendo um passeio náutico inesquecível pela Baía! O mar tá convidando e a lancha tá pronta. Bora? ⚓🚤☀️ #bomjesusospassos #entreasilhas #passeiodebarco #ferias",
    permalink: "https://www.instagram.com/entreasilhas",
    likes: 3120,
    comments: 185,
    mediaType: "VIDEO",
    date: "Há 2 semanas",
    location: "Bom Jesus dos Passos, BA"
  }
];
