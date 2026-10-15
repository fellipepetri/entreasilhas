"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { MaintenanceSettings } from "@/lib/content-types";
import { UnderConstruction } from "./under-construction";

interface MaintenanceGuardProps {
  maintenance?: MaintenanceSettings;
  children: React.ReactNode;
}

export function MaintenanceGuard({
  maintenance,
  children
}: MaintenanceGuardProps) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveMaintenance, setLiveMaintenance] = useState<MaintenanceSettings | undefined>(
    maintenance
  );

  // Rotas administrativas que NUNCA devem ser bloqueadas
  const isAdminRoute =
    pathname?.startsWith("/admin-painel") ||
    pathname?.startsWith("/agenda-painel") ||
    pathname?.startsWith("/api/");

  // Verifica se o usuário tem sessão ativa de administrador
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
          if (authData.authenticated && isMounted) {
            setIsAdmin(true);
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
          <aside
            role="status"
            aria-live="polite"
            className="fixed top-0 inset-x-0 z-[9999] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-semibold px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xl border-b border-amber-600"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🚧</span>
              <span>
                <strong>Modo Em Construção ATIVO:</strong> O público está visualizando a página de manutenção. Você tem permissão de administrador para navegar no site.
              </span>
            </div>
            <Link
              href="/admin-painel"
              className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-900 text-white px-3 py-1 rounded-full text-[11px] font-bold transition shadow-sm"
            >
              <span>Gerenciar no Painel</span>
              <span>⚙️</span>
            </Link>
          </aside>
          <div className="pt-9">
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
