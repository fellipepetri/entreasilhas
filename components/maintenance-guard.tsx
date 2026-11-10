"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { MaintenanceSettings } from "@/lib/content-types";
import { UnderConstruction } from "./under-construction";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface MaintenanceGuardProps {
  maintenance?: MaintenanceSettings;
  initialIsAdmin?: boolean;
  children: React.ReactNode;
}

export function MaintenanceGuard({
  maintenance,
  initialIsAdmin = false,
  children
}: MaintenanceGuardProps) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [liveMaintenance, setLiveMaintenance] = useState<MaintenanceSettings | undefined>(
    maintenance
  );
  const [bannerElement, setBannerElement] = useState<HTMLElement | null>(null);

  // Rotas administrativas que NUNCA devem ser bloqueadas
  const isAdminRoute =
    pathname?.startsWith("/admin-painel") ||
    pathname?.startsWith("/agenda-painel") ||
    pathname?.startsWith("/api/");

  // Verifica se o usuário tem sessão ativa de administrador e sincroniza conteúdo
  useEffect(() => {
    let isMounted = true;

    async function checkAdminAndSync() {
      try {
        const [authRes, contentRes] = await Promise.all([
          fetch("/api/admin/auth"),
          fetch("/api/site-content")
        ]);

        if (authRes.ok) {
          const authData = await authRes.json();
          if (isMounted) {
            setIsAdmin(Boolean(authData.authenticated));
          }
        }

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          if (contentData?.settings?.maintenance && isMounted) {
            setLiveMaintenance(contentData.settings.maintenance);
          }
        }
      } catch {
        // Fallback silencioso mantendo os dados iniciais
      }
    }

    checkAdminAndSync();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Mede com precisão a altura da barra administrativa e atualiza a variável CSS global --admin-banner-height
  useIsomorphicLayoutEffect(() => {
    if (!bannerElement) {
      document.documentElement.style.setProperty("--admin-banner-height", "0px");
      return;
    }

    const updateHeight = () => {
      const h = Math.round(
        bannerElement.getBoundingClientRect().height ||
          bannerElement.offsetHeight ||
          0
      );
      if (h > 0) {
        document.documentElement.style.setProperty(
          "--admin-banner-height",
          `${h}px`
        );
      }
    };

    updateHeight();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateHeight);
      ro.observe(bannerElement);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateHeight);
      document.documentElement.style.setProperty("--admin-banner-height", "0px");
    };
  }, [bannerElement]);

  // Se estiver em rota do painel administrativo, libera sempre
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Se o Modo Em Construção estiver ativado
  if (liveMaintenance?.enabled) {
    // Se for administrador autenticado, exibe o site com aviso de prévia
    if (isAdmin && liveMaintenance.allowAdminBypass) {
      return (
        <>
          <style
            dangerouslySetInnerHTML={{
              __html: ":root { --admin-banner-height: 41px; }"
            }}
          />
          <aside
            ref={setBannerElement}
            role="status"
            aria-live="polite"
            className="fixed top-0 inset-x-0 z-[9999] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-semibold px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xl border-b border-amber-600/80"
          >
            <div className="flex items-center gap-2 max-w-full">
              <span className="text-base shrink-0">🚧</span>
              <span className="leading-snug">
                <strong>Modo Em Construção ATIVO:</strong> O público está visualizando a página de manutenção. Você tem permissão de administrador para navegar no site.
              </span>
            </div>
            <Link
              href="/admin-painel"
              className="inline-flex shrink-0 items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold transition shadow-sm"
            >
              <span>Gerenciar no Painel</span>
              <span>⚙️</span>
            </Link>
          </aside>
          <div
            style={{ paddingTop: "var(--admin-banner-height, 41px)" }}
            className="min-h-screen flex flex-col transition-[padding-top] duration-150"
          >
            {children}
          </div>
        </>
      );
    }

    // Para visitantes comuns: exibe a página "Em Construção"
    return <UnderConstruction maintenance={liveMaintenance} />;
  }

  // Modo normal: exibe o site
  return <>{children}</>;
}
