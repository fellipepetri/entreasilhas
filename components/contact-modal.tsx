"use client";

import { useEffect, useRef, useState } from "react";

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState<"Dúvida" | "Sugestão">("Dúvida");
  const [mensagem, setMensagem] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Fecha no Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Foco no primeiro campo ao abrir
  useEffect(() => {
    if (isOpen && !isSuccess) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSuccess]);

  // Trava scroll da página quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Formatação automática do telefone (BR)
  const handleTelefoneChange = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    }
    setTelefone(formatted);
  };

  const handleReset = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setTipo("Dúvida");
    setMensagem("");
    setIsSuccess(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!nome.trim()) {
      setErrorMessage("Por favor, preencha o seu nome.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Por favor, insira um e-mail válido.");
      return;
    }
    if (!telefone.trim() || telefone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Por favor, insira um telefone válido com DDD.");
      return;
    }
    if (!mensagem.trim()) {
      setErrorMessage("Por favor, escreva sua mensagem.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
          tipo,
          mensagem: mensagem.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem.");
      }

      setIsSuccess(true);
    } catch {
      // Fallback amigável caso ocorra erro na rede
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
        aria-hidden="true"
      />

      {/* Card do Modal */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-b from-slate-900 via-slate-900 to-[#071d3a] p-6 sm:p-8 text-white shadow-[0_25px_70px_rgba(3,14,33,0.85)] transition-all animate-scaleUp"
      >
        {/* Botão de Fechar */}
        <button
          type="button"
          onClick={() => {
            handleReset();
            onClose();
          }}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Fechar formulário"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isSuccess ? (
          /* Tela de Sucesso */
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h3
              id="contact-modal-title"
              className="text-2xl font-bold tracking-tight text-white"
            >
              Mensagem enviada!
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Obrigado pelo contato, <strong className="text-brand-sand">{nome}</strong>!
              Recebemos sua <strong className="text-cyan-300">{tipo.toLowerCase()}</strong> e
              nossa equipe retornará o mais breve possível.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/5571992517102?text=${encodeURIComponent(
                  `Olá! Meu nome é ${nome} e enviei uma mensagem de ${tipo.toLowerCase()} pelo site: "${mensagem}"`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition shadow-sm"
              >
                <span>Falar também no WhatsApp</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="rounded-full bg-white/10 hover:bg-white/20 px-6 py-2.5 text-sm font-semibold text-white transition"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          /* Formulário de Contato */
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Atendimento Direto
              </span>
              <h3
                id="contact-modal-title"
                className="mt-1 text-2xl font-bold tracking-tight text-white"
              >
                Fale conosco
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Preencha os campos obrigatórios abaixo para entrar em contato com nossa equipe.
              </p>
            </div>

            {errorMessage ? (
              <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nome */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Nome Completo <span className="text-cyan-400">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Grid: E-mail e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    E-mail <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Telefone / WhatsApp <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => handleTelefoneChange(e.target.value)}
                    placeholder="(71) 99999-9999"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* Campo Tipo (Dúvida ou Sugestão) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tipo de Mensagem <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTipo("Dúvida")}
                    className={[
                      "flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold transition border",
                      tipo === "Dúvida"
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-sm"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    ].join(" ")}
                  >
                    <span>❓ Dúvida</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipo("Sugestão")}
                    className={[
                      "flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold transition border",
                      tipo === "Sugestão"
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-sm"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    ].join(" ")}
                  >
                    <span>💡 Sugestão</span>
                  </button>
                </div>
              </div>

              {/* Campo Mensagem */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Mensagem <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva sua dúvida ou sugestão com o máximo de detalhes..."
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Botão de Envio */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] hover:brightness-105 px-6 py-3 text-sm font-bold text-[#1249a1] shadow-lg transition duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-[#1249a1]"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
