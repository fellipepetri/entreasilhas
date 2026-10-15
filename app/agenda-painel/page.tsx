"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminLogin } from "@/components/admin/admin-login";
import { AgendaHeader } from "@/components/agenda-painel/agenda-header";
import { AgendaMetrics } from "@/components/agenda-painel/agenda-metrics";
import { AgendaCalendarView } from "@/components/agenda-painel/agenda-calendar-view";
import { AgendaListView } from "@/components/agenda-painel/agenda-list-view";
import { AgendaHistoryView } from "@/components/agenda-painel/agenda-history-view";
import { ClientDetailsModal } from "@/components/agenda-painel/client-details-modal";
import { NewBookingModal } from "@/components/agenda-painel/new-booking-modal";
import type { BookingItem, BookingStoreData } from "@/lib/booking-types";

export default function AgendaPainelPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState("admin");

  const [activeTab, setActiveTab] = useState<"calendario" | "lista" | "historico">("calendario");
  const [activeListFilter, setActiveListFilter] = useState<string>("todos");

  const [storeData, setStoreData] = useState<BookingStoreData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Modais
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<BookingItem | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [newBookingInitialDate, setNewBookingInitialDate] = useState<string | undefined>(undefined);

  // Notificações Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Checagem inicial de autenticação
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setCurrentUser(data.username || "admin");
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // 2. Carregar agendamentos do backend
  const loadBookings = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setStoreData(json.data);
      }
    } catch (err) {
      console.error("Erro ao carregar reservas:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    checkAuth().then((isAuthed) => {
      if (isAuthed) {
        loadBookings();
      }
    });
  }, [checkAuth, loadBookings]);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
      setStoreData(null);
    }
  };

  // Sucesso de Login
  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    loadBookings();
    showToast(`Bem-vindo ao Painel de Reservas, ${username}!`);
  };

  // Atualizar Reserva (chamado pelo modal de detalhes ou ações de lista)
  const handleUpdateBooking = async (id: string, partial: Partial<BookingItem>) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...partial })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStoreData(json.data);
        if (selectedBookingForModal && selectedBookingForModal.id === id) {
          setSelectedBookingForModal(json.booking);
        }
        showToast("Reserva atualizada com sucesso!");
      }
    } catch {
      showToast("Erro ao atualizar reserva.");
    }
  };

  // Criar Reserva Manual
  const handleCreateBooking = async (item: Omit<BookingItem, "id" | "createdAt">) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStoreData(json.data);
        showToast("Nova reserva cadastrada com sucesso!");
      }
    } catch {
      showToast("Erro ao cadastrar reserva.");
    }
  };

  // Alternar Bloqueio de Data
  const handleToggleBlockDate = async (dateStr: string, reason?: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_block", date: dateStr, reason })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStoreData(json.data);
        showToast(json.message);
      }
    } catch {
      showToast("Erro ao alterar bloqueio de data.");
    }
  };

  // Atalho ao clicar em um card de métrica
  const handleMetricCardClick = (filterId: string) => {
    if (filterId === "realizado") {
      setActiveTab("historico");
    } else {
      setActiveTab("lista");
      setActiveListFilter(filterId);
    }
  };

  // Abrir modal de criação com data pré-selecionada
  const handleOpenNewBookingWithDate = (dateStr: string) => {
    setNewBookingInitialDate(dateStr);
    setIsNewBookingModalOpen(true);
  };

  // 1. Estado de Carregamento inicial da Auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Verificando credenciais de acesso...</p>
      </div>
    );
  }

  // 2. Tela de Login se não autenticado
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={handleLoginSuccess}
        title="Painel de Reservas & Agenda"
        subtitle="Entre as Ilhas — Gestão de Charters & Passeios"
        badgeText="Controle de Agendamentos"
      />
    );
  }

  const bookingsList = storeData?.bookings || [];
  const blockedDatesList = storeData?.blockedDates || [];

  return (
    <div className="min-h-screen bg-[#071326] text-white flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-2xl animate-slideUp">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Fixo */}
      <AgendaHeader
        currentUserName={currentUser}
        onLogout={handleLogout}
        onOpenNewBookingModal={() => {
          setNewBookingInitialDate(undefined);
          setIsNewBookingModalOpen(true);
        }}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-7">
        {/* Métricas Informativas do Topo */}
        <section aria-label="Métricas Principais">
          <AgendaMetrics
            bookings={bookingsList}
            onSelectFilter={handleMetricCardClick}
            activeFilter={activeTab === "historico" ? "realizado" : activeListFilter}
          />
        </section>

        {/* Barra de Abas Principais de Visualização */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("calendario")}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer",
                activeTab === "calendario"
                  ? "bg-[linear-gradient(135deg,#16c2c0,#1498d5)] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              ].join(" ")}
            >
              <span>📅</span>
              <span>Calendário Interativo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("lista")}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer",
                activeTab === "lista"
                  ? "bg-[linear-gradient(135deg,#16c2c0,#1498d5)] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              ].join(" ")}
            >
              <span>📋</span>
              <span>Lista & Financeiro</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("historico")}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer",
                activeTab === "historico"
                  ? "bg-[linear-gradient(135deg,#16c2c0,#1498d5)] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              ].join(" ")}
            >
              <span>📜</span>
              <span>Histórico de Realizados</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            {isLoadingData ? (
              <span className="text-cyan-400 flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                Atualizando agendamentos...
              </span>
            ) : (
              <span>Dados sincronizados em tempo real</span>
            )}
          </div>
        </div>

        {/* Visualização Ativa */}
        {activeTab === "calendario" && (
          <section aria-label="Visualização em Calendário">
            <AgendaCalendarView
              bookings={bookingsList}
              blockedDates={blockedDatesList}
              onSelectBooking={(bk) => setSelectedBookingForModal(bk)}
              onOpenNewBookingWithDate={handleOpenNewBookingWithDate}
              onToggleBlockDate={handleToggleBlockDate}
            />
          </section>
        )}

        {activeTab === "lista" && (
          <section aria-label="Lista de Reservas e Financeiro">
            <AgendaListView
              bookings={bookingsList}
              onSelectBooking={(bk) => setSelectedBookingForModal(bk)}
              onUpdateBooking={handleUpdateBooking}
              initialFilter={activeListFilter}
            />
          </section>
        )}

        {activeTab === "historico" && (
          <section aria-label="Histórico de Passeios Realizados">
            <AgendaHistoryView
              bookings={bookingsList}
              onSelectBooking={(bk) => setSelectedBookingForModal(bk)}
            />
          </section>
        )}
      </main>

      {/* Modal Completo de Detalhes do Cliente (Disparado de qualquer ponto do sistema) */}
      <ClientDetailsModal
        booking={selectedBookingForModal}
        isOpen={selectedBookingForModal !== null}
        onClose={() => setSelectedBookingForModal(null)}
        onUpdateBooking={handleUpdateBooking}
      />

      {/* Modal de Nova Reserva ou Bloqueio de Data */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        initialDate={newBookingInitialDate}
        onCreateBooking={handleCreateBooking}
        onToggleBlockDate={handleToggleBlockDate}
      />
    </div>
  );
}
