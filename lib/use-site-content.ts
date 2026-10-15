"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "./content-types";
import { defaultSiteContent } from "@/data/default-content";

let globalCachedContent: SiteContent = defaultSiteContent;
let hasFetchedOnce = false;

export function useSiteContent(initialContent?: SiteContent) {
  const [content, setContent] = useState<SiteContent>(
    initialContent || globalCachedContent
  );
  const [isLoading, setIsLoading] = useState(!hasFetchedOnce);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await fetch("/api/site-content", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            globalCachedContent = data;
            hasFetchedOnce = true;
            setContent(data);
          }
        }
      } catch (err) {
        console.warn("Não foi possível carregar conteúdo dinâmico, usando padrão:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshContent = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/site-content", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        globalCachedContent = data;
        setContent(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { content, isLoading, refreshContent };
}
