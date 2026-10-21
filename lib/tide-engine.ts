/**
 * Motor de Cálculo e Sincronização com a Tábua de Marés de Madre de Deus
 * Baía de Todos-os-Santos (BTS), Bahia.
 *
 * Classifica a maré nos 6 níveis definidos para navegação:
 * 1. Maré cheia (preamar)
 * 2. Maré cheia/vazante (quando está toda cheia, mas começando a vazar)
 * 3. Maré intermediária/vazante (quando está entre a maré cheia e a baixa, mas está vazando)
 * 4. Maré baixa (baixa-mar)
 * 5. Maré baixa/enchente (quando está toda baixa, mas começando a encher)
 * 6. Maré intermediária/enchente (quando está entre a maré baixa e a cheia, mas está enchendo)
 */

export type TideLevelKey =
  | "cheia"
  | "cheia_vazante"
  | "intermediaria_vazante"
  | "baixa"
  | "baixa_enchente"
  | "intermediaria_enchente";

export interface TideLevelDefinition {
  key: TideLevelKey;
  name: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  icon: string;
  flow: "high" | "falling" | "low" | "rising";
}

export const TIDE_LEVELS: Record<TideLevelKey, TideLevelDefinition> = {
  cheia: {
    key: "cheia",
    name: "Maré cheia (preamar)",
    shortLabel: "Maré Cheia (Preamar)",
    description: "Nível máximo de água (preamar). Águas calmas, excelente calado e enseadas cheias.",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
    icon: "🌊",
    flow: "high"
  },
  cheia_vazante: {
    key: "cheia_vazante",
    name: "Maré cheia/vazante",
    shortLabel: "Cheia / Vazante",
    description: "Toda cheia, mas começando a vazar. Ótima circulação de água limpa e correnteza amena.",
    badgeClass: "bg-sky-100 text-sky-900 border-sky-300",
    icon: "📉",
    flow: "falling"
  },
  intermediaria_vazante: {
    key: "intermediaria_vazante",
    name: "Maré intermediária/vazante",
    shortLabel: "Intermediária / Vazante",
    description: "Entre a maré cheia e a baixa, vazando. Revelando os primeiros contornos dos bancos de areia.",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    icon: "⬇️",
    flow: "falling"
  },
  baixa: {
    key: "baixa",
    name: "Maré baixa (baixa-mar)",
    shortLabel: "Maré Baixa (Baixa-mar)",
    description: "Nível mínimo de maré (baixa-mar). Piscinas naturais expostas e bancos de areia cristalinos.",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    icon: "🏖️",
    flow: "low"
  },
  baixa_enchente: {
    key: "baixa_enchente",
    name: "Maré baixa/enchente",
    shortLabel: "Baixa / Enchente",
    description: "Toda baixa, mas começando a encher. Água morna e cristalina sobre as piscinas naturais.",
    badgeClass: "bg-teal-100 text-teal-900 border-teal-300",
    icon: "📈",
    flow: "rising"
  },
  intermediaria_enchente: {
    key: "intermediaria_enchente",
    name: "Maré intermediária/enchente",
    shortLabel: "Intermediária / Enchente",
    description: "Entre a maré baixa e a cheia, enchendo. Navegação suave com águas subindo para as praias.",
    badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-300",
    icon: "⬆️",
    flow: "rising"
  }
};

export const ALL_TIDE_KEYS: TideLevelKey[] = [
  "cheia",
  "cheia_vazante",
  "intermediaria_vazante",
  "baixa",
  "baixa_enchente",
  "intermediaria_enchente"
];

// Marco de calibração para Baía de Todos-os-Santos (Madre de Deus / Ilha dos Frades)
// Na Lua Nova de 11/01/2024, a primeira preamar ocorreu por volta das 04:15 da manhã.
const REF_TIME_MS = new Date("2024-01-11T04:15:00-03:00").getTime();
const M2_PERIOD_MS = 12.4206012 * 3600 * 1000; // ~12h 25m 14s

export interface TidePhaseInfo {
  key: TideLevelKey;
  name: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  icon: string;
  degree: number;
}

/**
 * Calcula o nível da maré em um instante específico (timestamp em ms)
 */
export function getTidePhaseAtTime(timestamp: number): TidePhaseInfo {
  let diff = (timestamp - REF_TIME_MS) % M2_PERIOD_MS;
  if (diff < 0) diff += M2_PERIOD_MS;
  const deg = (diff / M2_PERIOD_MS) * 360;

  let key: TideLevelKey;
  if (deg >= 330 || deg < 30) {
    key = "cheia";
  } else if (deg < 90) {
    key = "cheia_vazante";
  } else if (deg < 150) {
    key = "intermediaria_vazante";
  } else if (deg < 210) {
    key = "baixa";
  } else if (deg < 270) {
    key = "baixa_enchente";
  } else {
    key = "intermediaria_enchente";
  }

  const def = TIDE_LEVELS[key];
  return {
    ...def,
    degree: Math.round(deg)
  };
}

export interface DayTideEvaluation {
  dateISO: string;
  formattedDate: string;
  middayPhase: TidePhaseInfo;
  morningPhase: TidePhaseInfo; // Centro da janela matinal (10h15, entre 09h00 e 11h30)
  morningStartPhase: TidePhaseInfo; // Início do passeio (09h00)
  morningEndPhase: TidePhaseInfo; // Saída da primeira parada (11h30)
  afternoonPhase: TidePhaseInfo; // Tarde (14h30)
  phasesInTour: TidePhaseInfo[];
  summary: string;
}

/**
 * Avalia o comportamento da maré na data selecionada durante o horário do passeio (09h00 às 16h30)
 * com janela matinal específica de 09h00 às 11h30 (Loreto, Paramana e Piscinas Naturais).
 */
export function getDayTideEvaluation(targetDate: Date): DayTideEvaluation {
  const y = targetDate.getFullYear();
  const m = targetDate.getMonth();
  const d = targetDate.getDate();

  // Janela matinal: 09h00 às 11h30 (saída às 11h30)
  const morningStartTime = new Date(y, m, d, 9, 0, 0).getTime();
  const morningMidTime = new Date(y, m, d, 10, 15, 0).getTime();
  const morningEndTime = new Date(y, m, d, 11, 30, 0).getTime();

  // Janela central / almoço e paradas intermediárias: 12h00 às 13h30
  const middayTime = new Date(y, m, d, 12, 15, 0).getTime();

  // Janela vespertina / retorno: 14h30 às 16h00
  const afternoonTime = new Date(y, m, d, 14, 45, 0).getTime();

  const morningStartPhase = getTidePhaseAtTime(morningStartTime);
  const morningPhase = getTidePhaseAtTime(morningMidTime);
  const morningEndPhase = getTidePhaseAtTime(morningEndTime);
  const middayPhase = getTidePhaseAtTime(middayTime);
  const afternoonPhase = getTidePhaseAtTime(afternoonTime);

  // Fases presentes no intervalo do passeio
  const phasesMap = new Map<TideLevelKey, TidePhaseInfo>();
  phasesMap.set(morningStartPhase.key, morningStartPhase);
  phasesMap.set(morningPhase.key, morningPhase);
  phasesMap.set(morningEndPhase.key, morningEndPhase);
  phasesMap.set(middayPhase.key, middayPhase);
  phasesMap.set(afternoonPhase.key, afternoonPhase);

  const phasesInTour = Array.from(phasesMap.values());

  const dateISO = targetDate.toISOString().split("T")[0];
  const formattedDate = targetDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const summary = `Maré na janela matinal (09h–11h30): ${morningPhase.shortLabel} | Maré às 12h: ${middayPhase.name}`;

  return {
    dateISO,
    formattedDate,
    middayPhase,
    morningPhase,
    morningStartPhase,
    morningEndPhase,
    afternoonPhase,
    phasesInTour,
    summary
  };
}

export interface RouteTideStatus {
  isFavorable: boolean;
  statusLabel: string;
  currentTide: TidePhaseInfo;
  morningTide: TidePhaseInfo;
  bestTidesText: string;
  explanation: string;
  specificNotice?: string;
  alternativeStopNote?: string;
  warningTitle: string;
  warningMessage: string;
}

/**
 * Avalia a compatibilidade de um roteiro com a maré da data selecionada,
 * aplicando com exatidão as regras náuticas da Baía de Todos-os-Santos e
 * os horários específicos das paradas:
 *
 * - Roteiro 1: Paradas no Loreto e Paramana ocorrem exclusivamente das 09h às 11:30h (saída 11:30h).
 *   A favorabilidade é calculada diretamente nessa janela matinal.
 *
 * - Roteiro 2: A Praia Grande (Ilha das Vacas) é rasa e exige maré o mais cheia possível.
 *   Na maré intermediária, a parada recomendada é em Manguinho (mais acessível e segura).
 *
 * - Roteiro 3: Piscinas Naturais de Paramana operam exclusivamente das 09h às 11:30h (saída 11:30h)
 *   e requerem maré o mais baixa possível. Com maré alta, a parada alternativa é a Praia do Loreto.
 *
 * - Roteiro 4: Sugestão do marinheiro (100% dinâmico e adaptável a qualquer maré).
 */
export function evaluateRouteTideCompatibility(
  bestTides: TideLevelKey[] | undefined,
  targetDate: Date,
  routeName?: string,
  routeId?: string
): RouteTideStatus {
  const dayEval = getDayTideEvaluation(targetDate);
  const currentTide = dayEval.middayPhase;
  const morningTide = dayEval.morningPhase;

  const normalizedId = (routeId || "").toLowerCase();
  const normalizedName = (routeName || "").toLowerCase();

  const isRoute1 =
    normalizedId.includes("roteiro-1") ||
    normalizedName.includes("roteiro 1") ||
    normalizedName.includes("bom jesus dos passos");

  const isRoute2 =
    normalizedId.includes("roteiro-2") ||
    normalizedName.includes("roteiro 2") ||
    normalizedName.includes("ilha das vacas");

  const isRoute3 =
    normalizedId.includes("roteiro-3") ||
    normalizedName.includes("roteiro 3") ||
    normalizedName.includes("piscinas naturais") ||
    normalizedName.includes("paramana");

  const isRoute4 =
    normalizedId.includes("roteiro-4") ||
    normalizedName.includes("roteiro 4") ||
    normalizedName.includes("sugestão do marinheiro") ||
    normalizedName.includes("marinheiro") ||
    !bestTides ||
    bestTides.length >= 6;

  // 1. ROTEIRO 4: SUGESTÃO DO MARINHEIRO (Sempre 100% flexível)
  if (isRoute4 || !bestTides || bestTides.length === 0) {
    return {
      isFavorable: true,
      statusLabel: "Maré Favorável",
      currentTide,
      morningTide,
      bestTidesText: "Todas as marés (adaptado pelo marinheiro)",
      explanation:
        "Roteiro 100% dinâmico: o marinheiro avalia as condições exatas de vento e maré em tempo real e seleciona as melhores paradas do dia.",
      specificNotice:
        "🧭 Sugestão do marinheiro: melhores paradas definidas conforme o comportamento da maré e dos ventos no dia do passeio.",
      warningTitle: "Condição da Maré",
      warningMessage: ""
    };
  }

  const bestTidesText = bestTides.map((k) => TIDE_LEVELS[k]?.shortLabel || k).join(" • ");

  // 2. ROTEIRO 1: LORETO & PARAMANA (Janela 09h00 às 11h30)
  if (isRoute1) {
    // As paradas na Praia do Loreto e Praia de Paramana acontecem exclusivamente
    // entre 09h00 e 11h30 (com saída às 11:30h).
    // A melhor maré (intermediária/enchente, cheia, cheia/vazante) deve predominar
    // durante esta janela matinal:
    const isFavorable = bestTides.includes(dayEval.morningPhase.key);

    if (isFavorable) {
      return {
        isFavorable: true,
        statusLabel: "Maré Favorável",
        currentTide,
        morningTide,
        bestTidesText,
        explanation: `Na janela matinal das 09h às 11h30 (horário exclusivo das paradas no Loreto e Paramana), a maré estará em ${morningTide.name}, excelente condição para atracação e banho de mar calmo.`,
        specificNotice: `⏰ Janela 09h–11:30h: Maré em ${morningTide.shortLabel}, excelente calado para as paradas na Praia do Loreto e Paramana (saída programada às 11:30h).`,
        warningTitle: "Condição da Maré - Roteiro 1",
        warningMessage: ""
      };
    } else {
      return {
        isFavorable: false,
        statusLabel: "Maré não favorável",
        currentTide,
        morningTide,
        bestTidesText,
        explanation: `Na janela matinal das 09h às 11h30 (horário das paradas no Loreto e Paramana), a maré prevista estará em ${morningTide.name}. Para o melhor aproveitamento dessas enseadas, a maré recomendada deve ser: ${bestTidesText}.`,
        specificNotice: `⚠️ Janela 09h–11:30h desfavorável: Maré em ${morningTide.shortLabel}. As paradas no Loreto e Paramana exigem maré mais cheia (${bestTidesText}).`,
        warningTitle: "Aviso de Condição da Maré - Roteiro 1",
        warningMessage: `Na data selecionada (${dayEval.formattedDate}), a maré prevista na janela matinal das 09h às 11h30 é ${morningTide.name}.\n\nAs paradas na Praia do Loreto e Praia de Paramana somente são possíveis às 9h com saída às 11:30h e necessitam de maré favorável (${bestTidesText}). Com a maré em ${morningTide.shortLabel} nesse horário, a atracação e o banho de mar nessas praias ficam prejudicados.\n\nTem certeza que deseja selecionar este roteiro, visto que a maré não está favorável para as praias/paradas?`
      };
    }
  }

  // 3. ROTEIRO 2: ILHA DAS VACAS (Praia Grande rasa vs Manguinho)
  if (isRoute2) {
    // Avalia a maré predominante nas paradas principais (meio-dia e tarde)
    const isFavorable = bestTides.includes(currentTide.key);

    if (isFavorable) {
      // Verifica se a maré está cheia (preamar) para calado seguro na Praia Grande
      const isFullHighTide = currentTide.key === "cheia";

      if (isFullHighTide) {
        return {
          isFavorable: true,
          statusLabel: "Maré Favorável (Praia Grande)",
          currentTide,
          morningTide,
          bestTidesText,
          explanation:
            "Maré cheia (preamar): nível de água excelente e calado seguro para navegação e banho na Praia Grande da Ilha das Vacas (área rasa).",
          specificNotice:
            "🌊 Praia Grande liberada: maré cheia com profundidade ideal para atracação e banho na Ilha das Vacas.",
          warningTitle: "Condição da Maré - Roteiro 2",
          warningMessage: ""
        };
      } else {
        return {
          isFavorable: true,
          statusLabel: "Maré Favorável (Manguinho)",
          currentTide,
          morningTide,
          bestTidesText,
          explanation: `Maré em ${currentTide.name}: como a Praia Grande é uma área muito rasa, a parada recomendada na Ilha das Vacas será feita em Manguinho, parada mais acessível, abrigada e segura nesta maré.`,
          specificNotice:
            "⛵ Parada em Manguinho (Ilha das Vacas): mais acessível e segura na maré atual, contornando a área muito rasa da Praia Grande.",
          alternativeStopNote:
            "Parada na Ilha das Vacas em Manguinho (mais acessível com maré intermediária).",
          warningTitle: "Condição da Maré - Roteiro 2",
          warningMessage: ""
        };
      }
    } else {
      return {
        isFavorable: false,
        statusLabel: "Maré não favorável",
        currentTide,
        morningTide,
        bestTidesText,
        explanation: `A maré prevista na data (${currentTide.name}) não é favorável. A Praia Grande na Ilha das Vacas é uma região muito rasa que exige maré cheia, e mesmo Manguinho requer maré intermediária ou cheia (${bestTidesText}).`,
        specificNotice:
          "⚠️ Região rasa na Ilha das Vacas: calado raso para a Praia Grande e Manguinho na maré prevista.",
        warningTitle: "Aviso de Condição da Maré - Roteiro 2",
        warningMessage: `Na data selecionada (${dayEval.formattedDate}), a maré prevista durante as principais paradas é ${currentTide.name}.\n\nA região da Praia Grande na Ilha das Vacas é uma área onde tudo é muito raso e exige obrigatoriamente maré o mais cheia possível dentro da relação dos níveis. Mesmo a parada alternativa em Manguinho necessita de maré ${bestTidesText}.\n\nTem certeza que deseja selecionar este roteiro, visto que a maré não está favorável para as praias/paradas?`
      };
    }
  }

  // 4. ROTEIRO 3: PISCINAS NATURAIS DE PARAMANA (Janela 09h00 às 11h30, maré baixa)
  if (isRoute3) {
    // Parada exclusiva das 09h às 11:30h nas Piscinas Naturais de Paramana
    const morningKey = dayEval.morningPhase.key;
    const isLowestTide = morningKey === "baixa" || morningKey === "baixa_enchente";
    const isTideFalling = morningKey === "intermediaria_vazante";
    const isMorningLow = isLowestTide || isTideFalling;

    if (isMorningLow) {
      if (isLowestTide) {
        return {
          isFavorable: true,
          statusLabel: "Maré Favorável (Piscinas Naturais)",
          currentTide,
          morningTide,
          bestTidesText,
          explanation: `Excelente maré baixa! Na janela das 09h às 11h30, a maré estará o mais baixa possível (${morningTide.name}), expondo os bancos de areia e as piscinas cristalinas de Paramana com água na cintura.`,
          specificNotice:
            "🏖️ Piscinas Naturais de Paramana ativas (09h às 11:30h): maré baixa ideal com piscinas translúcidas e peixinhos.",
          warningTitle: "Condição da Maré - Roteiro 3",
          warningMessage: ""
        };
      } else {
        return {
          isFavorable: true,
          statusLabel: "Maré Favorável",
          currentTide,
          morningTide,
          bestTidesText,
          explanation: `Maré intermediária vazante entre 09h e 11h30: maré secando e favorável para aproveitar as piscinas de Paramana e praias de Guadalupe e Viração.`,
          specificNotice:
            "🏖️ Piscinas de Paramana (09h às 11:30h): maré vazante favorável às piscinas e enseadas dos Frades.",
          warningTitle: "Condição da Maré - Roteiro 3",
          warningMessage: ""
        };
      }
    } else {
      // Maré matinal alta (condições do Roteiro 1): Piscinas submersas, parada adaptada para Loreto
      return {
        isFavorable: false,
        statusLabel: "Maré não favorável (Piscinas submersas)",
        currentTide,
        morningTide,
        bestTidesText,
        explanation: `Na janela matinal das 09h às 11h30, a maré estará em ${morningTide.name}. As Piscinas Naturais de Paramana necessitam de maré o mais baixa possível; como as piscinas estarão submersas nesta maré, a parada matinal será adaptada para a Praia do Loreto.`,
        specificNotice:
          "⚠️ Piscinas Naturais submersas às 09h–11:30h. Parada matinal redirecionada para a Praia do Loreto.",
        alternativeStopNote:
          "Parada matinal na Praia do Loreto (piscinas naturais de Paramana submersas com maré alta).",
        warningTitle: "Aviso de Condição da Maré - Roteiro 3",
        warningMessage: `Na data selecionada (${dayEval.formattedDate}), a maré prevista na janela matinal das 09h às 11h30 é ${morningTide.name}.\n\nA parada nas Piscinas Naturais de Paramana somente é possível às 9h com saída às 11:30h e exige maré o mais baixa possível (${bestTidesText}). Com a maré em ${morningTide.shortLabel} nesse horário, as piscinas naturais estarão submersas e a parada será redirecionada para a Praia do Loreto (condições do Roteiro 1).\n\nTem certeza que deseja selecionar este roteiro, visto que a maré não está favorável para as praias/paradas?`
      };
    }
  }

  // 5. ROTEIROS GENÉRICOS (Caso cadastrado no painel admin)
  const isMiddayMatch = bestTides.includes(currentTide.key);
  const isAnyMatch = dayEval.phasesInTour.some((p) => bestTides.includes(p.key));
  const isFavorable = isMiddayMatch || isAnyMatch;
  const name = routeName || "este roteiro";

  const explanation = isFavorable
    ? `A maré prevista na data (${currentTide.name}) está excelente para as paradas deste roteiro.`
    : `A maré prevista na data (${currentTide.name}) não é o estado ideal para as paradas deste roteiro (melhor aproveitamento com: ${bestTidesText}).`;

  const warningTitle = "Aviso de Condição da Maré";
  const warningMessage = `Na data selecionada (${dayEval.formattedDate}), a maré prevista durante as principais paradas é ${currentTide.name}.\n\nAs paradas e praias do ${name} têm melhor aproveitamento com ${bestTidesText}, portanto a condição da maré NÃO está favorável nesta data.\n\nTem certeza que deseja selecionar este roteiro, visto que a maré não está favorável para as praias/paradas?`;

  return {
    isFavorable,
    statusLabel: isFavorable ? "Maré Favorável" : "Maré não favorável",
    currentTide,
    morningTide,
    bestTidesText,
    explanation,
    warningTitle,
    warningMessage
  };
}
