"use client";

import { useEffect, useState, useCallback } from "react";
import type { SiteContent } from "@/lib/content-types";
import { defaultSiteContent } from "@/data/default-content";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminHeader } from "@/components/admin/admin-header";
import { TabOverview } from "@/components/admin/tab-overview";
import { TabHero } from "@/components/admin/tab-hero";
import { TabExperience360 } from "@/components/admin/tab-experience-360";
import { TabGallery } from "@/components/admin/tab-gallery";
import { TabRoutes } from "@/components/admin/tab-routes";
import { TabTestimonials } from "@/components/admin/tab-testimonials";
import { TabAbout } from "@/components/admin/tab-about";
import { TabSettings } from "@/components/admin/tab-settings";

const TABS = [
  { id: "overview", label: "Visão Geral", icon: "📊" },
  { id: "hero", label: "Slide do Hero", icon: "🌅" },
  { id: "360", label: "Experiência 360°", icon: "🌐" },
  { id: "gallery", label: "Galeria de Fotos", icon: "🖼️" },
  { id: "routes", label: "Roteiros & Passeios", icon: "⛵" },
  { id: "testimonials", label: "Avaliações", icon: "⭐" },
  { id: "about", label: "Sobre a Agência", icon: "ℹ️" },
  { id: "settings", label: "Configurações", icon: "⚙️" }
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPainelPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("admin");

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const loadAdminContent = useCallback(async () => {
    setIsLoadingContent(true);
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do admin:", err);
    } finally {
      setIsLoadingContent(false);
    }
  }, []);

  // Verifica se o usuário já possui sessão ativa ao carregar a página
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && isMounted) {
            setIsAuthenticated(true);
            if (data.username) setUsername(data.username);
            loadAdminContent();
          }
        }
      } catch {
        // não autenticado
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [loadAdminContent]);

  // Ação de Salvar Conteúdo
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao salvar alterações.");
      }

      setHasUnsavedChanges(false);
      const now = new Date();
      setLastSavedAt(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
      showToast("Alterações salvas com sucesso no site! ✨");
    } catch {
      alert("Falha ao salvar alterações. Verifique sua conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  // Ação de Logout
  const handleLogout = async () => {
    if (confirm("Deseja realmente sair do painel administrativo?")) {
      try {
        await fetch("/api/admin/auth", { method: "DELETE" });
      } finally {
        setIsAuthenticated(false);
      }
    }
  };

  // Ação de Resetar Padrões
  const handleReset = async () => {
    const res = await fetch("/api/admin/reset", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.success) {
      setContent(data.content);
      setHasUnsavedChanges(false);
      showToast("Conteúdo restaurado para os padrões de fábrica! 🔄");
    } else {
      throw new Error("Erro ao restaurar");
    }
  };

  // Atualizadores parciais
  const updateContent = <K extends keyof SiteContent>(
    key: K,
    val: SiteContent[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: val
    }));
    setHasUnsavedChanges(true);
  };

  // Estado 1: Verificando autenticação inicial
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 tracking-wider uppercase font-semibold">
            Carregando painel administrativo...
          </p>
        </div>
      </div>
    );
  }

  // Estado 2: Não autenticado -> tela de Login
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={(loggedUser) => {
          setIsAuthenticated(true);
          setUsername(loggedUser);
          loadAdminContent();
        }}
      />
    );
  }

  // Estado 3: Autenticado -> Painel de Controle Completo
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Flutuante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 border border-emerald-500/40 p-4 text-xs font-semibold text-white shadow-2xl animate-bounce">
          <span className="text-base text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header do Painel */}
      <AdminHeader
        username={username}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onLogout={handleLogout}
        lastSavedAt={lastSavedAt}
        isMaintenanceEnabled={content.settings.maintenance?.enabled}
        onNavigateTab={(t) => setActiveTab(t as TabId)}
      />

      {/* Barra de Navegação por Abas */}
      <div className="border-b border-slate-200 bg-white sticky top-[61px] z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition",
                    isActive
                      ? "bg-brand-deep text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  ].join(" ")}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Conteúdo Principal da Aba Ativa */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingContent ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <span className="w-8 h-8 rounded-full border-2 border-brand-sea border-t-transparent animate-spin" />
            <p className="text-xs font-semibold">Carregando conteúdos...</p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <TabOverview
                content={content}
                onNavigateTab={(tab) => setActiveTab(tab as TabId)}
              />
            )}

            {activeTab === "hero" && (
              <TabHero
                slides={content.heroSlides}
                onChange={(slides) => updateContent("heroSlides", slides)}
              />
            )}

            {activeTab === "360" && (
              <TabExperience360
                data={content.experience360}
                onChange={(data) => updateContent("experience360", data)}
              />
            )}

            {activeTab === "gallery" && (
              <TabGallery
                data={content.gallery}
                onChange={(gallery) => updateContent("gallery", gallery)}
              />
            )}

            {activeTab === "routes" && (
              <TabRoutes
                homeItems={content.routes.homeItems}
                tours={content.routes.tours}
                onChangeHomeItems={(items) =>
                  setContent((prev) => ({
                    ...prev,
                    routes: { ...prev.routes, homeItems: items }
                  }))
                }
                onChangeTours={(tours) =>
                  setContent((prev) => ({
                    ...prev,
                    routes: { ...prev.routes, tours }
                  }))
                }
              />
            )}

            {activeTab === "testimonials" && (
              <TabTestimonials
                testimonials={content.testimonials}
                onChange={(testimonials) =>
                  updateContent("testimonials", testimonials)
                }
              />
            )}

            {activeTab === "about" && (
              <TabAbout
                data={content.about}
                onChange={(about) => updateContent("about", about)}
              />
            )}

            {activeTab === "settings" && (
              <TabSettings
                settings={content.settings}
                fullContent={content}
                onChangeSettings={(settings) =>
                  updateContent("settings", settings)
                }
                onImportFullContent={(imported) => {
                  setContent(imported);
                  setHasUnsavedChanges(true);
                }}
                onResetToDefaults={handleReset}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
