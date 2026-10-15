import fs from "fs/promises";
import path from "path";
import type { SiteContent } from "./content-types";
import { defaultSiteContent } from "@/data/default-content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE_PATH = path.join(DATA_DIR, "site-content.json");

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
        : defaultSiteContent.routes.tours
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
      ...(stored.settings || {})
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
    memoryCache = merged;
    lastReadTime = now;
    return merged;
  } catch {
    // Arquivo ainda não existe ou inválido: inicializa com default
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(
        CONTENT_FILE_PATH,
        JSON.stringify(defaultSiteContent, null, 2),
        "utf-8"
      );
    } catch {
      // Ignora falhas de escrita se ambiente for somente-leitura e retorna defaults
    }
    memoryCache = defaultSiteContent;
    lastReadTime = now;
    return defaultSiteContent;
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
      ? { ...current.settings, ...next.settings }
      : current.settings,
    lastUpdated: new Date().toISOString()
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    CONTENT_FILE_PATH,
    JSON.stringify(updated, null, 2),
    "utf-8"
  );

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
