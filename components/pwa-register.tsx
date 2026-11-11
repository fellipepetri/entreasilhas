"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const isAdminPath =
      window.location.pathname.startsWith("/admin-painel") ||
      window.location.pathname.startsWith("/agenda-painel");

    if (isAdminPath) {
      // No painel administrativo, desregistra o service worker e limpa caches para evitar interface obsoleta
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
      return;
    }

    // Register service worker para visitantes do site público
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        reg.update();
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("[PWA] Nova versão instalada.");
              }
            };
          }
        };
      })
      .catch((err) => {
        console.warn("[PWA] Falha ao registrar Service Worker:", err);
      });
  }, []);

  return null;
}
