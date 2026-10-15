"use client";

import { useRef, useState } from "react";
import type { GeneralSettings, MaintenanceSettings, SiteContent } from "@/lib/content-types";

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

  const maintenance: MaintenanceSettings = settings.maintenance || {
    enabled: false,
    title: "Estamos Preparando Novas Experiências",
    subtitle:
      "Nosso novo portal está sendo finalizado com muito carinho para oferecer o melhor em passeios de lancha privativos, roteiros pelas ilhas e agendamento online na Baía de Todos-os-Santos.",
    estimatedReturn: "Previsão de retorno: em breve!",
    contactWhatsApp: settings.whatsappNumber || "5571992517102",
    whatsappMessage:
      "Olá! Vi que o site da Entre as Ilhas está em construção, mas gostaria de tirar dúvidas e consultar disponibilidade de passeios de lancha.",
    instagramHandle: settings.instagramHandle || "@entreasilhas",
    instagramUrl: settings.instagramUrl || "https://www.instagram.com/entreasilhas",
    allowAdminBypass: true,
    showAdminLink: true
  };

  const handleUpdateMaintenance = <K extends keyof MaintenanceSettings>(
    field: K,
    value: MaintenanceSettings[K]
  ) => {
    onChangeSettings({
      ...settings,
      maintenance: {
        ...maintenance,
        [field]: value
      }
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

      {/* CARD: MODO EM CONSTRUÇÃO / MANUTENÇÃO */}
      <div
        className={`rounded-3xl border-2 p-6 shadow-sm space-y-6 transition-all duration-300 ${
          maintenance.enabled
            ? "border-amber-400 bg-amber-50/70"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚧</span>
              <h3 className="text-lg font-bold text-slate-900">
                Modo Em Construção / Manutenção do Site
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Quando ativado, qualquer visitante que acessar <strong>entreasilhas.com.br</strong> verá a página de &ldquo;Em Construção&rdquo;.
            </p>
          </div>

          {/* Switch de Ativação / Desativação */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                maintenance.enabled ? "text-amber-800 font-extrabold" : "text-slate-500"
              }`}
            >
              {maintenance.enabled ? "ATIVADO" : "DESATIVADO"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={maintenance.enabled}
              onClick={() => handleUpdateMaintenance("enabled", !maintenance.enabled)}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                maintenance.enabled ? "bg-amber-500 ring-2 ring-amber-300" : "bg-slate-300"
              }`}
              title={
                maintenance.enabled
                  ? "Clique para desativar o modo em construção"
                  : "Clique para ativar o modo em construção"
              }
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  maintenance.enabled ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Status Callout */}
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed ${
            maintenance.enabled
              ? "border-amber-300 bg-amber-100/70 text-amber-900"
              : "border-emerald-200 bg-emerald-50 text-emerald-900"
          }`}
        >
          {maintenance.enabled ? (
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <p className="font-bold">O Modo Em Construção está ATIVADO!</p>
                <p className="mt-0.5 text-amber-800">
                  Quem acessar <strong>entreasilhas.com.br</strong> verá a tela de manutenção.
                  Como você está logado no painel administrativo, você pode navegar no site normalmente para pré-visualizar as mudanças.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none">✅</span>
              <div>
                <p className="font-bold">O site está 100% PÚBLICO e acessível.</p>
                <p className="mt-0.5 text-emerald-800">
                  Todos os visitantes conseguem navegar normalmente pelas páginas de Início, Roteiros, Experiência 360° e Agendamento.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Campos Customizáveis da Página de Construção */}
        <div className="space-y-4 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Personalizar Textos da Página de Construção:
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título Principal da Página
              </label>
              <input
                type="text"
                value={maintenance.title}
                onChange={(e) => handleUpdateMaintenance("title", e.target.value)}
                placeholder="Ex: Estamos Preparando Novas Experiências"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Texto Explicativo / Subtítulo
              </label>
              <textarea
                rows={2}
                value={maintenance.subtitle}
                onChange={(e) => handleUpdateMaintenance("subtitle", e.target.value)}
                placeholder="Ex: Nosso novo portal está sendo finalizado com muito carinho..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previsão de Retorno / Lançamento
              </label>
              <input
                type="text"
                value={maintenance.estimatedReturn}
                onChange={(e) => handleUpdateMaintenance("estimatedReturn", e.target.value)}
                placeholder="Ex: Previsão de retorno: em breve!"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp de Atendimento (Com DDD)
              </label>
              <input
                type="text"
                value={maintenance.contactWhatsApp}
                onChange={(e) => handleUpdateMaintenance("contactWhatsApp", e.target.value)}
                placeholder="5571992517102"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mensagem Padrão do WhatsApp
              </label>
              <input
                type="text"
                value={maintenance.whatsappMessage}
                onChange={(e) => handleUpdateMaintenance("whatsappMessage", e.target.value)}
                placeholder="Ex: Olá! Vi que o site está em construção..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>
          </div>

          {/* Opções Avançadas de Acesso */}
          <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={maintenance.allowAdminBypass}
                onChange={(e) => handleUpdateMaintenance("allowAdminBypass", e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span>
                Permitir que <strong>administradores logados</strong> naveguem e visualizem o site normalmente (Bypass de Prévia)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={maintenance.showAdminLink}
                onChange={(e) => handleUpdateMaintenance("showAdminLink", e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span>
                Exibir link discreto de &ldquo;Acesso Administrativo 🔐&rdquo; no rodapé da página de construção
              </span>
            </label>
          </div>
        </div>
      </div>

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
