/**
 * Módulo de Meteorologia Náutica, Vento e Tábua de Marés
 * Especializado para a Baía de Todos-os-Santos (BTS), Bahia:
 * Ilha dos Frades, Ilha de Bom Jesus dos Passos e Madre de Deus.
 */

export interface TideEvent {
  timeFormatted: string;
  type: "Preamar" | "Baixa-mar";
  label: string;
  height: number; // metros
  kind: "high" | "low";
  timestamp: number;
}

export interface MoonInfo {
  phaseName: string;
  phaseIcon: string;
  illuminationPercent: number;
  moonAgeDays: number;
  isSizigia: boolean;
  tideRegimenName: string;
  tideRegimenDescription: string;
}

export interface TideReport {
  dateISO: string;
  formattedDate: string;
  moon: MoonInfo;
  events: TideEvent[];
  tourWindowSummary: string;
  islandAdvice: {
    ilhaDosFrades: string;
    bomJesus: string;
    madreDeDeus: string;
  };
}

export interface WindReport {
  speedKmh: number;
  speedKnots: number;
  directionDegrees: number;
  directionCardinal: string;
  directionDescription: string;
  gustsKmh: number;
  nauticalRating: "Excelente" | "Favorável" | "Atenção";
  bayCondition: string;
}

export interface WeatherReport {
  condition: string;
  conditionIcon: string;
  tempMax: number;
  tempMin: number;
  tempMidday: number;
  rainProbability: number;
  uvIndex: number;
  uvLevel: "Moderado" | "Alto" | "Muito Alto" | "Extremo";
  source: "realtime" | "climatology";
}

export interface ComprehensiveMarineReport {
  dateISO: string;
  formattedDate: string;
  weather: WeatherReport;
  wind: WindReport;
  tides: TideReport;
}

// Coordenadas centrais da região de navegação (Ilha dos Frades / Madre de Deus)
export const BTS_COORDINATES = {
  latitude: -12.79,
  longitude: -38.64,
  name: "Baía de Todos-os-Santos (Ilha dos Frades, Bom Jesus dos Passos e Madre de Deus)"
};

/**
 * Cálculo astronômico preciso da fase da lua e iluminação
 */
export function getMoonInfo(date: Date): MoonInfo {
  // Marco de referência da Lua Nova: 11 de Janeiro de 2024 às 11:57 UTC
  const refNewMoon = new Date("2024-01-11T11:57:00Z").getTime();
  const synodicMonth = 29.530588853 * 86400 * 1000;

  const diff = date.getTime() - refNewMoon;
  const cycleFraction = (((diff % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth;
  const moonAgeDays = +(cycleFraction * 29.530588853).toFixed(1);

  // Porcentagem de iluminação visível (0% a 100%)
  const illuminationPercent = Math.round((1 - Math.cos(2 * Math.PI * cycleFraction)) / 2 * 100);

  let phaseName = "";
  let phaseIcon = "";

  if (cycleFraction < 0.04 || cycleFraction >= 0.96) {
    phaseName = "Lua Nova";
    phaseIcon = "🌑";
  } else if (cycleFraction < 0.21) {
    phaseName = "Lua Crescente";
    phaseIcon = "🌒";
  } else if (cycleFraction < 0.29) {
    phaseName = "Quarto Crescente";
    phaseIcon = "🌓";
  } else if (cycleFraction < 0.46) {
    phaseName = "Crescente Gibosa";
    phaseIcon = "🌔";
  } else if (cycleFraction < 0.54) {
    phaseName = "Lua Cheia";
    phaseIcon = "🌕";
  } else if (cycleFraction < 0.71) {
    phaseName = "Minguante Gibosa";
    phaseIcon = "🌖";
  } else if (cycleFraction < 0.79) {
    phaseName = "Quarto Minguante";
    phaseIcon = "🌗";
  } else {
    phaseName = "Lua Minguante";
    phaseIcon = "🌘";
  }

  // Fator Sizígia (Lua Nova ou Cheia) vs Quadratura (Quartos)
  const springNeapFactor = (Math.cos(2 * 2 * Math.PI * cycleFraction) + 1) / 2;
  const isSizigia = springNeapFactor > 0.45;

  const tideRegimenName = isSizigia ? "Maré de Sizígia (Grande Amplitude)" : "Maré de Quadratura (Amplitude Moderada)";
  const tideRegimenDescription = isSizigia
    ? "Variação acentuada entre cheia e seca. Ideal para bancos de areia e piscinas naturais cristalinas na maré baixa."
    : "Variação suave com correntes amenas. Mar calmo e navegação ultra estável pelas enseadas abrigadas.";

  return {
    phaseName,
    phaseIcon,
    illuminationPercent,
    moonAgeDays,
    isSizigia,
    tideRegimenName,
    tideRegimenDescription
  };
}

/**
 * Cálculo da Tábua de Marés para a Baía de Todos-os-Santos (Madre de Deus / Ilha dos Frades)
 * Baseado no estabelecimento do porto local e período semidiurno lunar (M2 ~ 12h 25m).
 */
export function calculateTidesForDate(targetDate: Date): TideReport {
  const y = targetDate.getFullYear();
  const m = targetDate.getMonth();
  const d = targetDate.getDate();

  // Início e fim do dia no horário local
  const targetDayStart = new Date(y, m, d, 0, 0, 0).getTime();
  const targetDayEnd = new Date(y, m, d, 23, 59, 59, 999).getTime();

  // Marco de calibração para Baía de Todos-os-Santos (Salvador / Madre de Deus)
  // Na Lua Nova de 11/01/2024, a primeira preamar ocorreu por volta das 04:15 da manhã.
  const refTime = new Date("2024-01-11T04:15:00-03:00").getTime();
  const m2Period = 12.4206012 * 3600 * 1000; // ~12h 25m 14s

  const moon = getMoonInfo(new Date(y, m, d, 12, 0, 0));

  // Amplitude em metros conforme Sizígia (1.8m a 2.6m alta / 0.1m a 0.8m baixa)
  const cycleFraction = moon.moonAgeDays / 29.530588853;
  const springNeapFactor = (Math.cos(2 * 2 * Math.PI * cycleFraction) + 1) / 2;

  const highTideHeight = +(1.85 + springNeapFactor * 0.75).toFixed(1);
  const lowTideHeight = +(0.85 - springNeapFactor * 0.65).toFixed(1);

  const periodsSinceRef = Math.floor((targetDayStart - refTime) / m2Period) - 2;
  const events: TideEvent[] = [];

  for (let i = periodsSinceRef; i <= periodsSinceRef + 6; i++) {
    const highTime = refTime + i * m2Period;
    const lowTime = highTime + m2Period / 2;

    if (highTime >= targetDayStart && highTime <= targetDayEnd) {
      const hDate = new Date(highTime);
      events.push({
        timeFormatted: `${String(hDate.getHours()).padStart(2, "0")}:${String(hDate.getMinutes()).padStart(2, "0")}`,
        type: "Preamar",
        label: "Preamar (Maré Alta)",
        height: highTideHeight,
        kind: "high",
        timestamp: highTime
      });
    }

    if (lowTime >= targetDayStart && lowTime <= targetDayEnd) {
      const lDate = new Date(lowTime);
      events.push({
        timeFormatted: `${String(lDate.getHours()).padStart(2, "0")}:${String(lDate.getMinutes()).padStart(2, "0")}`,
        type: "Baixa-mar",
        label: "Baixa-mar (Maré Baixa)",
        height: lowTideHeight,
        kind: "low",
        timestamp: lowTime
      });
    }
  }

  // Ordena por horário cronológico
  events.sort((a, b) => a.timestamp - b.timestamp);

  // Análise específica para o horário do passeio náutico (09:00 às 16:30)
  const tourStart = new Date(y, m, d, 9, 0, 0).getTime();
  const tourEnd = new Date(y, m, d, 16, 30, 0).getTime();

  const tourEvents = events.filter((e) => e.timestamp >= tourStart && e.timestamp <= tourEnd);
  let tourWindowSummary = "";

  if (tourEvents.length > 0) {
    const eventDescs = tourEvents.map((e) => `${e.label} às ${e.timeFormatted} (${e.height}m)`);
    tourWindowSummary = `Durante o horário de navegação (09h às 16h30): ${eventDescs.join(" e ")}. Condição perfeita para combinar banho de mar e paradas em ilhas.`;
  } else {
    // Sem pico no intervalo, verificar se está enchendo ou vazando
    const nextEvent = events.find((e) => e.timestamp > tourStart);
    if (nextEvent) {
      const action = nextEvent.kind === "high" ? "enchendo rumo à preamar" : "vazando rumo à maré seca";
      tourWindowSummary = `Maré em movimento contínuo durante o passeio, ${action} (${nextEvent.label} às ${nextEvent.timeFormatted}).`;
    } else {
      tourWindowSummary = "Maré equilibrada para navegação e fundeio de lazer.";
    }
  }

  // Dicas náuticas locais adaptadas ao regime de maré da data
  const dateISO = targetDate.toISOString().split("T")[0];
  const formattedDate = targetDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const islandAdvice = {
    ilhaDosFrades: moon.isSizigia
      ? "Ponta de Nossa Senhora e Loreto com bancos de areia expostos na maré baixa. Ideal para caminhar nas piscinas naturais com água cristalina na altura da cintura!"
      : "Águas calmas e translúcidas o dia inteiro em Guadalupe e Loreto. Excelente calado para ancoragem segura próxima à praia.",
    bomJesus: "Canal abrigado entre ilhas com águas límpidas e sem ondulação. Perfeito para parada de almoço e atracação nos restaurantes e vilarejo histórico.",
    madreDeDeus: "Ponto de partida tranquilo, com mar calmo e canal protegido para embarque e desembarque seguro de toda a família."
  };

  return {
    dateISO,
    formattedDate,
    moon,
    events,
    tourWindowSummary,
    islandAdvice
  };
}

/**
 * Converte graus de direção do vento em ponto cardeal e descrição náutica
 */
export function getWindDirectionDetails(degrees: number): {
  cardinal: string;
  description: string;
} {
  const normalized = ((degrees % 360) + 360) % 360;

  if (normalized >= 337.5 || normalized < 22.5) return { cardinal: "N", description: "Norte (Vento terral)" };
  if (normalized < 67.5) return { cardinal: "NE", description: "Nordeste (Brisa refrescante)" };
  if (normalized < 112.5) return { cardinal: "E", description: "Leste (Alísio clássico da Baía)" };
  if (normalized < 157.5) return { cardinal: "ESE / SE", description: "Sudeste (Alísios amenos predominantes)" };
  if (normalized < 202.5) return { cardinal: "S", description: "Sul (Brisa oceânica)" };
  if (normalized < 247.5) return { cardinal: "SW", description: "Sudoeste (Abrigado no interior da Baía)" };
  if (normalized < 292.5) return { cardinal: "W", description: "Oeste (Vento brando de terra)" };
  return { cardinal: "NW", description: "Noroeste (Águas calmas)" };
}

/**
 * Climatologia náutica típica da Baía de Todos-os-Santos por mês
 * (Utilizada para datas futuras além de 14 dias ou como fallback resiliente)
 */
export function getBTSClimatology(date: Date): {
  weather: WeatherReport;
  wind: WindReport;
} {
  const month = date.getMonth(); // 0 a 11

  // Padrões climáticos médios de Salvador / BTS (Primavera/Verão: mais sol; Outono/Inverno: chuvas rápidas passageiras)
  const isSummerSpring = month >= 8 || month <= 2; // Setembro a Março
  const tempMax = isSummerSpring ? 30.5 : 28.0;
  const tempMin = isSummerSpring ? 24.5 : 23.0;
  const tempMidday = isSummerSpring ? 29.0 : 27.0;
  const rainProb = isSummerSpring ? 15 : 35;
  const windKmh = isSummerSpring ? 17 : 20;
  const windKnots = +(windKmh * 0.539957).toFixed(1);
  const uvIndex = isSummerSpring ? 9 : 7;

  return {
    weather: {
      condition: isSummerSpring ? "Predomínio de sol e céu aberto" : "Sol com nuvens e brisa marítima",
      conditionIcon: isSummerSpring ? "☀️" : "🌤️",
      tempMax,
      tempMin,
      tempMidday,
      rainProbability: rainProb,
      uvIndex,
      uvLevel: uvIndex >= 8 ? "Muito Alto" : "Alto",
      source: "climatology"
    },
    wind: {
      speedKmh: windKmh,
      speedKnots: windKnots,
      directionDegrees: 110,
      directionCardinal: "ESE",
      directionDescription: "Leste-Sudeste (Alísios amenos da Baía)",
      gustsKmh: windKmh + 5,
      nauticalRating: "Excelente",
      bayCondition: "Águas abrigadas e mar calmo, navegação confortável e segura"
    }
  };
}

/**
 * Mapeamento dos códigos meteorológicos WMO da Open-Meteo
 */
function parseWmoWeatherCode(code: number): { condition: string; icon: string } {
  switch (code) {
    case 0:
      return { condition: "Céu limpo e ensolarado", icon: "☀️" };
    case 1:
      return { condition: "Predomínio de sol com poucas nuvens", icon: "🌤️" };
    case 2:
      return { condition: "Parcialmente nublado com sol", icon: "⛅" };
    case 3:
      return { condition: "Encoberto com aberturas de sol", icon: "🌥️" };
    case 45:
    case 48:
      return { condition: "Névoa matinal que dissipa ao meio-dia", icon: "🌫️" };
    case 51:
    case 53:
      return { condition: "Garoa passageira e sol", icon: "🌦️" };
    case 55:
    case 61:
      return { condition: "Chuva fraca e isolada", icon: "🌦️" };
    case 63:
    case 65:
      return { condition: "Chuva passageira", icon: "🌧️" };
    case 80:
    case 81:
    case 82:
      return { condition: "Pancadas rápidas de verão", icon: "🌦️" };
    case 95:
      return { condition: "Instabilidade isolada", icon: "⛈️" };
    default:
      return { condition: "Tempo tropical agradável", icon: "🌤️" };
  }
}

// Cache local simples em memória para evitar chamadas redundantes
const forecastCache = new Map<string, ComprehensiveMarineReport>();

/**
 * Obtém o relatório náutico e meteorológico completo para a data selecionada
 */
export async function getComprehensiveMarineReport(targetDate: Date): Promise<ComprehensiveMarineReport> {
  const dateISO = targetDate.toISOString().split("T")[0];

  // Verifica cache em memória
  if (forecastCache.has(dateISO)) {
    return forecastCache.get(dateISO)!;
  }

  const tides = calculateTidesForDate(targetDate);
  const now = new Date();
  const diffDays = Math.round((targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  // Climatologia padrão
  const climatology = getBTSClimatology(targetDate);
  let weather = climatology.weather;
  let wind = climatology.wind;

  // Se a data estiver dentro da janela de previsão (hoje até 14 dias), busca dados ao vivo da Open-Meteo
  if (diffDays >= -1 && diffDays <= 14) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${BTS_COORDINATES.latitude}&longitude=${BTS_COORDINATES.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,wind_gusts_10m_max,uv_index_max&timezone=America%2FBahia`;
      
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        // Em navegadores não deve travar
        signal: AbortSignal.timeout(3500)
      });

      if (res.ok) {
        const data = await res.json();
        const dates: string[] = data?.daily?.time || [];
        const index = dates.indexOf(dateISO);

        if (index !== -1) {
          const wmo = data.daily.weather_code[index];
          const parsedWmo = parseWmoWeatherCode(wmo);
          const tMax = +(data.daily.temperature_2m_max[index] ?? 29.5).toFixed(1);
          const tMin = +(data.daily.temperature_2m_min[index] ?? 24.0).toFixed(1);
          const rainProb = Math.round(data.daily.precipitation_probability_max?.[index] ?? 10);
          const uv = Math.round(data.daily.uv_index_max?.[index] ?? 8);

          const windMaxKmh = Math.round(data.daily.wind_speed_10m_max[index] ?? 18);
          const windGustsKmh = Math.round(data.daily.wind_gusts_10m_max?.[index] ?? windMaxKmh + 4);
          const windDirDeg = Math.round(data.daily.wind_direction_10m_dominant[index] ?? 115);
          const windDir = getWindDirectionDetails(windDirDeg);
          const windKnots = +(windMaxKmh * 0.539957).toFixed(1);

          weather = {
            condition: parsedWmo.condition,
            conditionIcon: parsedWmo.icon,
            tempMax: tMax,
            tempMin: tMin,
            tempMidday: +(tMax - 1.0).toFixed(1),
            rainProbability: rainProb,
            uvIndex: uv,
            uvLevel: uv >= 11 ? "Extremo" : uv >= 8 ? "Muito Alto" : uv >= 6 ? "Alto" : "Moderado",
            source: "realtime"
          };

          const nauticalRating = windKnots < 14 ? "Excelente" : windKnots < 20 ? "Favorável" : "Atenção";
          const bayCondition =
            windKnots < 14
              ? "Mar calmo e abrigado na Baía • Ideal para banho de mar e navegação em família"
              : "Brisa oceânica moderada • Navegação protegida pelas enseadas das ilhas";

          wind = {
            speedKmh: windMaxKmh,
            speedKnots: windKnots,
            directionDegrees: windDirDeg,
            directionCardinal: windDir.cardinal,
            directionDescription: windDir.description,
            gustsKmh: windGustsKmh,
            nauticalRating,
            bayCondition
          };
        }
      }
    } catch {
      // Em caso de falha de rede/timeout, mantém a climatologia de alta fidelidade
    }
  }

  const report: ComprehensiveMarineReport = {
    dateISO,
    formattedDate: tides.formattedDate,
    weather,
    wind,
    tides
  };

  forecastCache.set(dateISO, report);
  return report;
}
