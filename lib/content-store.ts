import fs from "fs/promises";
import path from "path";
import type { SiteContent } from "./content-types";
import { defaultSiteContent, defaultSiteFeatures } from "@/data/default-content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE_PATH = path.join(DATA_DIR, "site-content.json");
const SYSTEM_SETTINGS_FILE_PATH = path.join(DATA_DIR, "system-settings.json");

let memoryCache: SiteContent | null = null;
let lastReadTime = 0;
const CACHE_TTL_MS = 2000; // 2 segundos de cache em memória para performance rápida

function deepMergeDefaults(stored: Partial<SiteContent>): SiteContent {
  return {
    ...defaultSiteContent,
    ...stored,
    heroSlides: stored.heroSlides?.length ? stored.heroSlides : defaultSiteContent.heroSlides,
    about: {
      ...defaultSiteContent.about,
      ...(stored.about || {})
    },
    routes: {
      homeItems: stored.routes?.homeItems?.length
        ? stored.routes.homeItems
        : defaultSiteContent.routes.homeItems,
      tours: stored.routes?.tours?.length
        ? stored.routes.tours
        : defaultSiteContent.routes.tours,
      bookingRoutes: stored.routes?.bookingRoutes?.length
        ? stored.routes.bookingRoutes
        : defaultSiteContent.routes.bookingRoutes
    },
    gallery: {
      ...defaultSiteContent.gallery,
      ...(stored.gallery || {}),
      cards: stored.gallery?.cards?.length
        ? stored.gallery.cards
        : defaultSiteContent.gallery.cards
    },
    experience360: {
      ...defaultSiteContent.experience360,
      ...(stored.experience360 || {}),
      scenes: stored.experience360?.scenes?.length
        ? stored.experience360.scenes
        : defaultSiteContent.experience360.scenes,
      secretsCatalog: stored.experience360?.secretsCatalog?.length
        ? stored.experience360.secretsCatalog
        : defaultSiteContent.experience360.secretsCatalog
    },
    testimonials: stored.testimonials?.length
      ? stored.testimonials
      : defaultSiteContent.testimonials,
    instagram: {
      profile: {
        ...defaultSiteContent.instagram.profile,
        ...(stored.instagram?.profile || {})
      },
      curatedPosts: stored.instagram?.curatedPosts?.length
        ? stored.instagram.curatedPosts
        : defaultSiteContent.instagram.curatedPosts
    },
    settings: {
      ...defaultSiteContent.settings,
      ...(stored.settings || {}),
      features: {
        ...defaultSiteFeatures,
        ...(stored.settings?.features || {})
      },
      maintenance: {
        ...defaultSiteContent.settings.maintenance!,
        ...(stored.settings?.maintenance || {})
      }
    }
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const now = Date.now();
  if (memoryCache && now - lastReadTime < CACHE_TTL_MS) {
    return memoryCache;
  }

  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    const merged = deepMergeDefaults(parsed);

    // Persistência adicional: lê system-settings.json para garantir que Modo de Manutenção e Features nunca se percam
    try {
      const rawSettings = await fs.readFile(SYSTEM_SETTINGS_FILE_PATH, "utf-8");
      const parsedSettings = JSON.parse(rawSettings);
      if (parsedSettings && typeof parsedSettings === "object") {
        if (parsedSettings.maintenance) {
          merged.settings.maintenance = {
            ...merged.settings.maintenance,
            ...parsedSettings.maintenance
          };
        }
        if (parsedSettings.features) {
          merged.settings.features = {
            ...merged.settings.features,
            ...parsedSettings.features
          };
        }
      }
    } catch {
      // system-settings.json opcional
    }

    memoryCache = merged;
    lastReadTime = now;
    return merged;
  } catch {
    // Arquivo ainda não existe ou inválido: inicializa com default
    let fresh = { ...defaultSiteContent };

    // Tenta resgatar configurações salvas do sistema se existirem
    try {
      const rawSettings = await fs.readFile(SYSTEM_SETTINGS_FILE_PATH, "utf-8");
      const parsedSettings = JSON.parse(rawSettings);
      if (parsedSettings && typeof parsedSettings === "object") {
        if (parsedSettings.maintenance) {
          fresh.settings = {
            ...fresh.settings,
            maintenance: {
              ...fresh.settings.maintenance!,
              ...parsedSettings.maintenance
            }
          };
        }
        if (parsedSettings.features) {
          fresh.settings = {
            ...fresh.settings,
            features: {
              ...defaultSiteFeatures,
              ...parsedSettings.features
            }
          };
        }
      }
    } catch {
      // Ignora
    }

    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(
        CONTENT_FILE_PATH,
        JSON.stringify(fresh, null, 2),
        "utf-8"
      );
    } catch {
      // Ignora falhas de escrita se ambiente for somente-leitura e retorna defaults
    }
    memoryCache = fresh;
    lastReadTime = now;
    return fresh;
  }
}

export async function saveSiteContent(
  next: Partial<SiteContent>
): Promise<SiteContent> {
  const current = await getSiteContent();
  const updated: SiteContent = {
    ...current,
    ...next,
    heroSlides: next.heroSlides ?? current.heroSlides,
    about: next.about ? { ...current.about, ...next.about } : current.about,
    routes: next.routes
      ? {
          homeItems: next.routes.homeItems ?? current.routes.homeItems,
          tours: next.routes.tours ?? current.routes.tours
        }
      : current.routes,
    gallery: next.gallery
      ? {
          ...current.gallery,
          ...next.gallery,
          cards: next.gallery.cards ?? current.gallery.cards
        }
      : current.gallery,
    experience360: next.experience360
      ? {
          ...current.experience360,
          ...next.experience360,
          scenes: next.experience360.scenes ?? current.experience360.scenes,
          secretsCatalog:
            next.experience360.secretsCatalog ?? current.experience360.secretsCatalog
        }
      : current.experience360,
    testimonials: next.testimonials ?? current.testimonials,
    instagram: next.instagram
      ? {
          profile: next.instagram.profile
            ? { ...current.instagram.profile, ...next.instagram.profile }
            : current.instagram.profile,
          curatedPosts:
            next.instagram.curatedPosts ?? current.instagram.curatedPosts
        }
      : current.instagram,
    settings: next.settings
      ? {
          ...current.settings,
          ...next.settings,
          features: next.settings.features
            ? {
                ...(current.settings.features || defaultSiteFeatures),
                ...next.settings.features
              }
            : current.settings.features,
          maintenance: next.settings.maintenance
            ? {
                ...(current.settings.maintenance || defaultSiteContent.settings.maintenance!),
                ...next.settings.maintenance
              }
            : current.settings.maintenance
        }
      : current.settings,
    lastUpdated: new Date().toISOString()
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    CONTENT_FILE_PATH,
    JSON.stringify(updated, null, 2),
    "utf-8"
  );

  // Salva adicionalmente no system-settings.json para garantir sobrevivência a deploys e reinicializações
  try {
    const systemSettings = {
      maintenance: updated.settings.maintenance,
      features: updated.settings.features,
      savedAt: new Date().toISOString()
    };
    await fs.writeFile(
      SYSTEM_SETTINGS_FILE_PATH,
      JSON.stringify(systemSettings, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.warn("Falha ao salvar system-settings.json:", err);
  }

  memoryCache = updated;
  lastReadTime = Date.now();
  return updated;
}

export async function resetSiteContent(): Promise<SiteContent> {
  const fresh = {
    ...defaultSiteContent,
    lastUpdated: new Date().toISOString()
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    CONTENT_FILE_PATH,
    JSON.stringify(fresh, null, 2),
    "utf-8"
  );

  memoryCache = fresh;
  lastReadTime = Date.now();
  return fresh;
}
