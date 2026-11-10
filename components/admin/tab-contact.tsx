"use client";

import { useState } from "react";
import type { ContactSectionData } from "@/lib/content-types";

interface TabContactProps {
  data: ContactSectionData;
  onChange: (data: ContactSectionData) => void;
}

export function TabContact({ data, onChange }: TabContactProps) {
  const [subTab, setSubTab] = useState<"page" | "cards" | "modal">("page");

  const handleUpdate = (field: keyof ContactSectionData, value: unknown) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleUpdateCard = (
    cardKey: "whatsappCard" | "instagramCard",
    field: string,
    value: string
  ) => {
    onChange({
      ...data,
      [cardKey]: {
        ...data[cardKey],
        [field]: value
      }
    });
  };

  const handleUpdateLocation = (field: string, value: string) => {
    onChange({
      ...data,
      locationCard: {
        ...data.locationCard,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Contato & Canais de Atendimento
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure todos os textos da página /contato, dos cards de canais e do modal de mensagens.
          </p>
        </div>

        {/* Sub-abas de navegação interna */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab("page")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "page"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            📄 Cabeçalho /contato
          </button>
          <button
            type="button"
            onClick={() => setSubTab("cards")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "cards"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            📇 Cartões de Canais
          </button>
          <button
            type="button"
            onClick={() => setSubTab("modal")}
            className={[
              "px-3 py-1.5 rounded-lg transition",
              subTab === "modal"
                ? "bg-white text-brand-deep shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            ].join(" ")}
          >
            💬 Modal do Formulário
          </button>
        </div>
      </div>

      {/* SUB-ABA 1: CABEÇALHO DA PÁGINA /CONTATO */}
      {subTab === "page" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Textos de Apresentação da Página (/contato)
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Etiqueta / Pré-Título (Eyebrow)
              </label>
              <input
                type="text"
                value={data.pageEyebrow}
                onChange={(e) => handleUpdate("pageEyebrow", e.target.value)}
                placeholder="Ex: Fale Conosco"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título Principal da Página
              </label>
              <input
                type="text"
                value={data.pageTitle}
                onChange={(e) => handleUpdate("pageTitle", e.target.value)}
                placeholder="Ex: Canais de Atendimento"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descrição Introdutória
              </label>
              <textarea
                rows={3}
                value={data.pageDescription}
                onChange={(e) => handleUpdate("pageDescription", e.target.value)}
                placeholder="Ex: Entre em contato com a equipe Entre as Ilhas para tirar dúvidas..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Institucional de Recebimento
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleUpdate("email", e.target.value)}
                placeholder="contato@entreasilhas.com.br"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                E-mail para onde as mensagens enviadas pelo formulário do site serão direcionadas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA 2: CARTÕES DE CANAIS DE ATENDIMENTO */}
      {subTab === "cards" && (
        <div className="space-y-6">
          {/* Card 1: WhatsApp */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base border-b border-emerald-200/60 pb-2">
              <span>💬</span>
              <span>Cartão 1: Canal do WhatsApp</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag / Selo do Card
                </label>
                <input
                  type="text"
                  value={data.whatsappCard.badge}
                  onChange={(e) =>
                    handleUpdateCard("whatsappCard", "badge", e.target.value)
                  }
                  placeholder="Ex: Atendimento Rápido"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título do Card
                </label>
                <input
                  type="text"
                  value={data.whatsappCard.title}
                  onChange={(e) =>
                    handleUpdateCard("whatsappCard", "title", e.target.value)
                  }
                  placeholder="Ex: WhatsApp"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto Explicativo
                </label>
                <input
                  type="text"
                  value={data.whatsappCard.description}
                  onChange={(e) =>
                    handleUpdateCard("whatsappCard", "description", e.target.value)
                  }
                  placeholder="Ex: Converse diretamente com nossos consultores para orçamentos e reservas."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número Formatado para Exibição
                </label>
                <input
                  type="text"
                  value={data.whatsappCard.value}
                  onChange={(e) =>
                    handleUpdateCard("whatsappCard", "value", e.target.value)
                  }
                  placeholder="+55 (71) 99251-7302"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link Direto do WhatsApp (wa.me)
                </label>
                <input
                  type="text"
                  value={data.whatsappCard.link}
                  onChange={(e) =>
                    handleUpdateCard("whatsappCard", "link", e.target.value)
                  }
                  placeholder="https://wa.me/5571992517302"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Instagram */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-base border-b border-rose-200/60 pb-2">
              <span>📸</span>
              <span>Cartão 2: Perfil do Instagram</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag / Selo do Card
                </label>
                <input
                  type="text"
                  value={data.instagramCard.badge}
                  onChange={(e) =>
                    handleUpdateCard("instagramCard", "badge", e.target.value)
                  }
                  placeholder="Ex: Rede Social Oficial"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título do Card
                </label>
                <input
                  type="text"
                  value={data.instagramCard.title}
                  onChange={(e) =>
                    handleUpdateCard("instagramCard", "title", e.target.value)
                  }
                  placeholder="Ex: Instagram"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto Explicativo
                </label>
                <input
                  type="text"
                  value={data.instagramCard.description}
                  onChange={(e) =>
                    handleUpdateCard("instagramCard", "description", e.target.value)
                  }
                  placeholder="Ex: Acompanhe stories diários, saídas de barco, marés e paisagens da Baía."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome de Usuário (@)
                </label>
                <input
                  type="text"
                  value={data.instagramCard.value}
                  onChange={(e) =>
                    handleUpdateCard("instagramCard", "value", e.target.value)
                  }
                  placeholder="@entreasilhas"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link Direto do Perfil
                </label>
                <input
                  type="text"
                  value={data.instagramCard.link}
                  onChange={(e) =>
                    handleUpdateCard("instagramCard", "link", e.target.value)
                  }
                  placeholder="https://www.instagram.com/entreasilhas"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Base da Operação */}
          <div className="rounded-3xl border border-sky-200 bg-sky-50/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sky-800 font-bold text-base border-b border-sky-200/60 pb-2">
              <span>📍</span>
              <span>Cartão 3: Base da Operação & Embarques</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag / Selo do Card
                </label>
                <input
                  type="text"
                  value={data.locationCard.badge}
                  onChange={(e) =>
                    handleUpdateLocation("badge", e.target.value)
                  }
                  placeholder="Ex: Base da Operação"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Base / Região
                </label>
                <input
                  type="text"
                  value={data.locationCard.title}
                  onChange={(e) =>
                    handleUpdateLocation("title", e.target.value)
                  }
                  placeholder="Ex: Baía de Todos-os-Santos"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição dos Embarques
                </label>
                <textarea
                  rows={2}
                  value={data.locationCard.description}
                  onChange={(e) =>
                    handleUpdateLocation("description", e.target.value)
                  }
                  placeholder="Ex: Embarques programados nas principais marinas e pontos de apoio náutico de Salvador e região."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nota de Atendimento
                </label>
                <input
                  type="text"
                  value={data.locationCard.note}
                  onChange={(e) =>
                    handleUpdateLocation("note", e.target.value)
                  }
                  placeholder="Ex: Atendimento mediante reserva prévia."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA 3: MODAL DE CONTATO / FORMULÁRIO */}
      {subTab === "modal" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Textos do Modal de Contato (Botão com Balão de Conversa no Topo)
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título do Modal
              </label>
              <input
                type="text"
                value={data.modalTitle}
                onChange={(e) => handleUpdate("modalTitle", e.target.value)}
                placeholder="Ex: Fale Conosco"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subtítulo do Modal
              </label>
              <input
                type="text"
                value={data.modalSubtitle}
                onChange={(e) => handleUpdate("modalSubtitle", e.target.value)}
                placeholder="Ex: Preencha os campos abaixo e retornaremos em breve."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
