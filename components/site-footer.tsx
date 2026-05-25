import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,152,213,0.26),_transparent_30%),linear-gradient(180deg,_rgba(9,39,77,0.88),_rgba(7,25,52,0.96))]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-[-1px] overflow-hidden">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-24 w-full rotate-180 md:h-28 lg:h-32"
        >
          <path
            fill="#ffffff"
            d="M0 68C24 58 48 48 72 48C96 48 120 58 144 68C168 78 192 88 216 88C240 88 264 78 288 68C312 58 336 48 360 48C384 48 408 58 432 68C456 78 480 88 504 88C528 88 552 78 576 68C600 58 624 48 648 48C672 48 696 58 720 68C744 78 768 88 792 88C816 88 840 78 864 68C888 58 912 48 936 48C960 48 984 58 1008 68C1032 78 1056 88 1080 88C1104 88 1128 78 1152 68C1176 58 1200 48 1224 48C1248 48 1272 58 1296 68C1320 78 1344 88 1368 88C1392 88 1416 78 1440 68V160H0Z"
          />
        </svg>
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-10 pt-28">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 border-b border-white/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
                Vamos navegar
              </p>
              <p className="mt-4 max-w-2xl text-white">
                Base inspirada no layout de referência, adaptada para a identidade
                da Entre as Ilhas.
              </p>
            </div>
            <a href="tel:+5571999999999" className="text-xl font-semibold text-white md:text-2xl">
              +55 (71) 99999-9999
            </a>
          </div>

          <div className="rounded-[2rem] border border-white/14 bg-white/8 p-8 backdrop-blur-sm">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-xl font-semibold text-white">Links úteis</p>
                <div className="mt-5 flex flex-col gap-3 text-white">
                  <Link href="/">Início</Link>
                  <Link href="/passeios">Passeios</Link>
                  <Link href="/sobre">Sobre</Link>
                  <Link href="/contato">Contato</Link>
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Base da operação</p>
                <div className="mt-5 space-y-3 text-white">
                  <p className="text-white">Baía de Todos-os-Santos, Bahia</p>
                  <p className="text-white">Atendimento por reserva e planejamento prévio</p>
                  <p className="text-white">contato@entreasilhas.com.br</p>
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Receber novidades</p>
                <div className="mt-5 flex flex-col overflow-hidden rounded-[1.6rem] border border-white/18 bg-white/10 sm:flex-row sm:items-center sm:rounded-full">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full bg-transparent px-5 py-4 text-sm text-white placeholder:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    className="mx-2 mb-2 rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] px-5 py-3 text-sm font-semibold text-white sm:mb-0"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm uppercase tracking-[0.3em] text-white">
            Entre as Ilhas. 2026. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
