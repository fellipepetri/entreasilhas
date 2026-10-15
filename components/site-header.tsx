"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNavigationLinks } from "@/data/home";
import { ContactModal } from "@/components/contact-modal";
import { PlanTourModal } from "@/components/booking/plan-tour-modal";

const navigationSectionIds = primaryNavigationLinks.map((link) =>
  link.href === "/" ? "inicio" : link.href.replace("#", "")
);

function getSectionIdFromHref(href: string) {
  return href === "/" ? "inicio" : href.replace("#", "");
}

function BrandMark({
  scrolled,
  compact = false,
  onNavigate
}: {
  scrolled: boolean;
  compact?: boolean;
  onNavigate?: (href: string, event?: React.MouseEvent) => void;
}) {
  return (
    <Link
      href="/"
      onClick={(e) => onNavigate?.("/", e)}
      className="flex min-w-0 items-center gap-2.5 sm:gap-3"
    >
      <div
        className={[
          "relative shrink-0 overflow-hidden",
          compact ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11"
        ].join(" ")}
      >
        <Image
          src="/images/logoeai.png"
          alt="Entre as Ilhas"
          fill
          sizes={compact ? "36px" : "44px"}
          className="object-contain"
        />
      </div>
      <span
        className={[
          compact
            ? "hidden whitespace-nowrap text-[1.45rem] font-semibold leading-none tracking-[-0.04em] transition-colors duration-300 xl:inline-block"
            : "inline-block whitespace-nowrap text-[1.05rem] sm:text-[1.35rem] md:text-[1.6rem] font-bold leading-none tracking-[-0.03em] transition-colors duration-300",
          scrolled ? "text-black" : "text-white"
        ].join(" ")}
      >
        Entre as Ilhas
      </span>
    </Link>
  );
}

function CalendarPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M10 16h4" />
      <path d="M12 14v4" />
    </svg>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function DesktopTopHeader({
  isScrolled,
  activeSection,
  onNavigate,
  onOpenContactModal,
  onOpenPlanTourModal
}: {
  isScrolled: boolean;
  activeSection: string;
  onNavigate: (href: string, event?: React.MouseEvent) => void;
  onOpenContactModal: () => void;
  onOpenPlanTourModal: () => void;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute inset-x-0 top-0 hidden px-8 pt-4 transition-all duration-500 xl:block md:px-10 md:pt-5 xl:px-12 2xl:px-14",
        isScrolled
          ? "-translate-y-[120%] opacity-0 duration-300"
          : "translate-y-0 opacity-100 delay-150 duration-500"
      ].join(" ")}
      aria-hidden={isScrolled}
    >
      <div className="mx-auto flex w-full max-w-[116rem] items-center justify-between gap-4">
        <div className="top-header-shell pointer-events-auto flex min-h-[4.05rem] flex-1 items-center justify-between gap-6 rounded-[2.4rem] border border-transparent px-5 shadow-[0_24px_80px_rgba(6,28,57,0.32)] backdrop-blur-xl">
          <BrandMark scrolled={false} compact onNavigate={onNavigate} />
          <nav className="mr-2 flex items-center gap-6 2xl:gap-10" aria-label="Principal">
            {primaryNavigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => onNavigate(link.href, e)}
                className={[
                  "text-[0.89rem] font-medium transition",
                  activeSection === getSectionIdFromHref(link.href)
                    ? "text-brand-sand"
                    : "text-white hover:text-brand-sand"
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="top-header-shell pointer-events-auto flex min-h-[4.05rem] items-center gap-3.5 rounded-[2.4rem] border border-transparent px-5 shadow-[0_24px_80px_rgba(6,28,57,0.32)] backdrop-blur-xl">
          <button
            type="button"
            onClick={onOpenPlanTourModal}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] px-6 py-2.5 text-[0.89rem] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-surf hover:brightness-105 hover:text-[#1249a1] cursor-pointer"
          >
            <CalendarPlusIcon className="h-4 w-4 shrink-0 transition-colors duration-300" />
            <span>Planejar passeio</span>
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenContactModal}
              title="Fale conosco / Envie uma mensagem"
              aria-label="Fale conosco - Abrir formulário"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-brand-deep border border-slate-200 transition duration-300 hover:bg-brand-deep hover:text-white hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            >
              <ChatBubbleIcon className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/5571992517102"
              target="_blank"
              rel="noopener noreferrer"
              title="Fale conosco no WhatsApp"
              aria-label="Fale conosco no WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs transition duration-300 hover:bg-emerald-600 hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopScrolledHeader({
  isScrolled,
  activeSection,
  onNavigate,
  onOpenContactModal,
  onOpenPlanTourModal
}: {
  isScrolled: boolean;
  activeSection: string;
  onNavigate: (href: string, event?: React.MouseEvent) => void;
  onOpenContactModal: () => void;
  onOpenPlanTourModal: () => void;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute inset-x-0 top-0 hidden transition-all xl:block",
        isScrolled
          ? "translate-y-0 opacity-100 delay-150 duration-500"
          : "-translate-y-[105%] opacity-0 duration-300"
      ].join(" ")}
      aria-hidden={!isScrolled}
    >
      <div className="pointer-events-auto border-b border-black/6 bg-white shadow-[0_14px_40px_rgba(10,40,79,0.10)]">
        <div className="mx-auto flex min-h-[3.95rem] w-full max-w-[116rem] items-center justify-between gap-4 px-6 xl:px-8 2xl:px-10">
          <BrandMark scrolled compact onNavigate={onNavigate} />

          <nav className="flex items-center gap-4 xl:gap-5 2xl:gap-7" aria-label="Principal fixo">
            {primaryNavigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => onNavigate(link.href, e)}
                className={[
                  "text-[0.88rem] font-medium transition",
                  activeSection === getSectionIdFromHref(link.href)
                    ? "text-brand-sea"
                    : "text-brand-deep hover:text-brand-sea"
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenPlanTourModal}
              className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] px-5 py-2 text-[0.88rem] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-surf hover:brightness-105 hover:text-[#1249a1] cursor-pointer"
            >
              <CalendarPlusIcon className="h-4 w-4 shrink-0 transition-colors duration-300" />
              <span>Planejar passeio</span>
            </button>
            <button
              type="button"
              onClick={onOpenContactModal}
              title="Fale conosco / Envie uma mensagem"
              aria-label="Fale conosco - Abrir formulário"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-brand-deep border border-slate-200 transition duration-300 hover:bg-brand-deep hover:text-white hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            >
              <ChatBubbleIcon className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/5571992517102"
              target="_blank"
              rel="noopener noreferrer"
              title="Fale conosco no WhatsApp"
              aria-label="Fale conosco no WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs transition duration-300 hover:bg-emerald-600 hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPlanTourModalOpen, setIsPlanTourModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const pathname = usePathname();
  const router = useRouter();

  function handleNavigate(href: string, event?: React.MouseEvent) {
    const isAnchor = href.startsWith("#") || href === "/";
    const isHome = pathname === "/";

    if (isHome && isAnchor) {
      if (event) {
        event.preventDefault();
      }

      window.dispatchEvent(new Event("cancelSmoothScroll"));

      const targetId = href === "/" ? "inicio" : href.replace(/^#/, "");

      if (targetId === "inicio") {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        try {
          history.pushState(null, "", "/");
        } catch {
          // fallback
        }
        setActiveSection("inicio");
      } else {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerOffset = window.innerWidth >= 1024 ? 80 : 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth"
          });

          try {
            history.pushState(null, "", href);
          } catch {
            // fallback
          }
          setActiveSection(targetId);
        }
      }
    } else if (!isHome && href.startsWith("#")) {
      if (event) {
        event.preventDefault();
      }
      router.push(`/${href}`);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/") return;
    const hash = window.location.hash;
    if (hash && hash !== "#") {
      const targetId = decodeURIComponent(hash.slice(1));
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const timer = setTimeout(() => {
          const headerOffset = window.innerWidth >= 1024 ? 80 : 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth"
          });
          setActiveSection(targetId);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 44);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navigationSectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) {
      return;
    }

    function syncActiveSection() {
      const viewportProbe = window.innerHeight * 0.42;
      let nextActiveSection = sections[0].id;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= viewportProbe && rect.bottom >= viewportProbe) {
          nextActiveSection = section.id;
          break;
        }

        if (rect.top < viewportProbe) {
          nextActiveSection = section.id;
        }
      }

      setActiveSection(nextActiveSection);
    }

    syncActiveSection();
    window.addEventListener("scroll", syncActiveSection, { passive: true });
    window.addEventListener("resize", syncActiveSection);

    return () => {
      window.removeEventListener("scroll", syncActiveSection);
      window.removeEventListener("resize", syncActiveSection);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (pathname?.startsWith("/admin-painel") || pathname?.startsWith("/agenda-painel")) {
    return null;
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <DesktopTopHeader
          isScrolled={isScrolled}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          onOpenPlanTourModal={() => setIsPlanTourModalOpen(true)}
        />
        <DesktopScrolledHeader
          isScrolled={isScrolled}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          onOpenPlanTourModal={() => setIsPlanTourModalOpen(true)}
        />

        <div className="px-3 sm:px-4 pt-3 sm:pt-4 xl:hidden">
          <div
            className={[
              "mx-auto flex items-center justify-between gap-3 sm:gap-4 rounded-[2rem] border px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-500",
              isScrolled
                ? "border-brand-deep/8 bg-white/96 shadow-[0_18px_45px_rgba(10,40,79,0.12)]"
                : "border-white/30 bg-[linear-gradient(135deg,rgba(10,40,79,0.78),rgba(20,72,117,0.68))] backdrop-blur-xl"
            ].join(" ")}
          >
            <BrandMark scrolled={isScrolled} onNavigate={handleNavigate} />

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className={[
                "inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border transition",
                isScrolled
                  ? "border-brand-deep/12 bg-brand-foam text-brand-deep"
                  : "border-white/30 bg-white/10 text-white"
              ].join(" ")}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <span className="text-xl font-bold leading-none">✕</span>
              ) : (
                <span className="space-y-1.5">
                  <span className="block h-0.5 w-5 bg-current rounded-full" />
                  <span className="block h-0.5 w-5 bg-current rounded-full" />
                  <span className="block h-0.5 w-5 bg-current rounded-full" />
                </span>
              )}
            </button>
          </div>

          {isOpen ? (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs xl:hidden"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              <div className="relative z-50 mx-auto mt-2.5 sm:mt-3 rounded-[1.8rem] border border-brand-deep/8 bg-white/98 p-5 sm:p-6 shadow-2xl backdrop-blur animate-fadeIn">
                <nav className="flex flex-col gap-3" aria-label="Mobile">
                  {primaryNavigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        handleNavigate(link.href, e);
                        setIsOpen(false);
                      }}
                      className={[
                        "text-base font-semibold py-1.5 transition border-b border-slate-100 last:border-b-0",
                        activeSection === getSectionIdFromHref(link.href)
                          ? "text-brand-sea"
                          : "text-brand-deep hover:text-brand-sea"
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setIsPlanTourModalOpen(true);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] hover:brightness-105 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:text-[#1249a1] shadow-sm cursor-pointer"
                    >
                      <CalendarPlusIcon className="h-4 w-4 shrink-0 transition-colors duration-300" />
                      <span>Planejar passeio</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          setIsContactModalOpen(true);
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition cursor-pointer"
                      >
                        <ChatBubbleIcon className="h-4 w-4 text-brand-sea" />
                        <span>Mensagem</span>
                      </button>
                      <a
                        href="https://wa.me/5571992517102"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition"
                      >
                        <WhatsAppIcon className="h-4 w-4 text-white" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </nav>
              </div>
            </>
          ) : null}
        </div>
      </header>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <PlanTourModal
        isOpen={isPlanTourModalOpen}
        onClose={() => setIsPlanTourModalOpen(false)}
      />
    </>
  );
}
