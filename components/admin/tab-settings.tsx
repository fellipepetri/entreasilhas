"use client";

import { useRef, useState } from "react";
import type { GeneralSettings, SiteContent } from "@/lib/content-types";

interface TabSettingsProps {
  settings: GeneralSettings;
  fullContent: SiteContent;
  onChangeSettings: (settings: GeneralSettings) => void;
  onImportFullContent: (imported: SiteContent) => void;
  onResetToDefaults: () => Promise<void>;
}

export function TabSettings({
  settings,
  fullContent,
  onChangeSettings,
  onImportFullContent,
  onResetToDefaults
}: TabSettingsProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const fileImportRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (field: keyof GeneralSettings, value: string) => {
    onChangeSettings({
      ...settings,
      [field]: value
    });
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(fullContent, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `backup-entreasilhas-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Arquivo JSON inválido.");
        }
        if (
          confirm(
            "Deseja substituir todo o conteúdo atual pelo arquivo importado? Esta ação não pode ser desfeita sem outro backup."
          )
        ) {
          onImportFullContent(parsed);
          alert("Backup importado com sucesso! Lembre-se de salvar.");
        }
      } catch {
        alert("Erro ao ler o arquivo JSON de backup. Formato inválido.");
      }
    };
    reader.readAsText(file);
    if (fileImportRef.current) {
      fileImportRef.current.value = "";
    }
  };

  const handleResetConfirm = async () => {
    if (
      confirm(
        "Atenção: Deseja realmente restaurar todos os textos, fotos e roteiros para os padrões originais de fábrica? Todas as personalizações não salvas serão substituídas."
      )
    ) {
      setIsResetting(true);
      setResetMessage(null);
      try {
        await onResetToDefaults();
        setResetMessage("Todos os conteúdos foram restaurados com sucesso para os padrões originais!");
      } catch {
        setResetMessage("Falha ao restaurar padrões.");
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Configurações Gerais & Canais de Atendimento
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Números de contato, links das redes sociais, backups e restauração do sistema.
        </p>
      </div>

      {resetMessage && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          {resetMessage}
        </div>
      )}

      {/* Canais Oficiais de Contato */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Atendimento & WhatsApp Oficial
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Número WhatsApp (Apenas Números)
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) =>
                handleUpdate(
                  "whatsappNumber",
                  e.target.value.replace(/[^0-9]/g, "")
                )
              }
              placeholder="5571992517102"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Código do país + DDD + telefone (ex: 5571992517102)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Número Formatado para Exibição
            </label>
            <input
              type="text"
              value={settings.whatsappFormatted}
              onChange={(e) => handleUpdate("whatsappFormatted", e.target.value)}
              placeholder="+55 (71) 99251-7102"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Mensagem Padrão de Início de Conversa
          </label>
          <textarea
            rows={2}
            value={settings.whatsappDefaultMessage}
            onChange={(e) =>
              handleUpdate("whatsappDefaultMessage", e.target.value)
            }
            placeholder="Olá! Gostaria de informações sobre os passeios de lancha da Entre as Ilhas."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
          />
        </div>
      </div>

      {/* Gerenciamento de Credenciais de Acesso */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Segurança & Credenciais do Administrador
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Para garantir a máxima segurança, o usuário e a senha de administrador são
          protegidos diretamente por variáveis de ambiente do servidor no arquivo{" "}
          <code className="text-brand-deep bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">
            .env.local
          </code>
          :
        </p>

        <div className="rounded-2xl bg-slate-950 p-4 text-xs font-mono text-cyan-300 space-y-1">
          <p>ADMIN_USERNAME=admin</p>
          <p>ADMIN_PASSWORD=entreasilhas2026!</p>
          <p>ADMIN_SESSION_SECRET=eai_admin_super_secret_session_key_2026</p>
        </div>

        <p className="text-[11px] text-slate-500">
          Você pode alterar a senha a qualquer momento editando a variável{" "}
          <code>ADMIN_PASSWORD</code> no arquivo <code>.env.local</code> (ou no painel da sua hospedagem).
        </p>
      </div>

      {/* Backup & Restauração */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Backup, Exportação & Restauração
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 text-xs shadow-sm transition"
          >
            <span>Baixar Cópia de Segurança (JSON)</span>
            <span>💾</span>
          </button>

          <input
            ref={fileImportRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileImportRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3 text-xs shadow-sm transition"
          >
            <span>Importar Backup (JSON)</span>
            <span>📂</span>
          </button>

          <button
            type="button"
            disabled={isResetting}
            onClick={handleResetConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-5 py-3 text-xs shadow-sm transition sm:ml-auto"
          >
            <span>{isResetting ? "Restaurando..." : "Restaurar Padrões Originais"}</span>
            <span>⚠️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
