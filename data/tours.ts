export type Tour = {
  slug: string;
  name: string;
  summary: string;
};

export const tours: Tour[] = [
  {
    slug: "travessia-inicial",
    name: "Travessia Inicial",
    summary: "Mock inicial para validar listagem e rota dinâmica de passeios."
  },
  {
    slug: "roteiro-praias",
    name: "Roteiro Praias",
    summary: "Item de exemplo para servir como base dos futuros dados reais."
  }
];
