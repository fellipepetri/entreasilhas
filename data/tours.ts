export type Tour = {
  slug: string;
  name: string;
  summary: string;
};

export const tours: Tour[] = [
  {
    slug: "ilha-dos-frades-guadalupe",
    name: "Ilha dos Frades & Guadalupe",
    summary: "Águas cristalinas, praias preservadas com Bandeira Azul e gastronomia baiana à beira-mar."
  },
  {
    slug: "bom-jesus-dos-passos",
    name: "Bom Jesus dos Passos & Histórico",
    summary: "O aconchego das ilhas tradicionais, mar calmo de enseada e paradas estratégicas para banho."
  },
  {
    slug: "coroa-do-frade-bancos-de-areia",
    name: "Coroa do Frade & Bancos de Areia",
    summary: "Piscina natural em mar aberto na maré baixa, água morna e pôr do sol inesquecível na Baía."
  },
  {
    slug: "volta-completa-nas-ilhas",
    name: "Volta Completa nas Ilhas (Day Use)",
    summary: "Experiência náutica exclusiva de dia inteiro sob medida para o seu grupo com conforto total."
  }
];
