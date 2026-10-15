"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNavigationLinks } from "@/data/home";

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

function DesktopTopHeader({
  isScrolled,
  activeSection,
  onNavigate
}: {
  isScrolled: boolean;
  activeSection: string;
  onNavigate: (href: string, event?: React.MouseEvent) => void;
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

        <div className="top-header-shell pointer-events-auto flex min-h-[4.05rem] items-center gap-5 rounded-[2.4rem] border border-transparent px-5 shadow-[0_24px_80px_rgba(6,28,57,0.32)] backdrop-blur-xl">
          <Link
            href="/contato"
            className="rounded-full bg-[#1fc8c2] px-7 py-2.5 text-[0.89rem] font-bold text-[#08264e] transition duration-300 hover:-translate-y-0.5 hover:shadow-surf hover:bg-[#25dbd4]"
          >
            Planejar passeio
          </Link>
          <a
            href="https://wa.me/5571992517102"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.89rem] font-semibold text-white transition-colors duration-200 hover:text-brand-sand"
          >
            Fale conosco
          </a>
        </div>
      </div>
    </div>
  );
}

function DesktopScrolledHeader({
  isScrolled,
  activeSection,
  onNavigate
}: {
  isScrolled: boolean;
  activeSection: string;
  onNavigate: (href: string, event?: React.MouseEvent) => void;
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

          <div className="flex items-center gap-4">
            <Link
              href="/contato"
              className="rounded-full bg-[#1fc8c2] px-5 py-2 text-[0.88rem] font-bold text-[#08264e] transition duration-300 hover:-translate-y-0.5 hover:shadow-surf hover:bg-[#25dbd4]"
            >
              Planejar passeio
            </Link>
            <a
              href="https://wa.me/5571992517102"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[0.88rem] font-semibold text-brand-deep transition-colors duration-200 hover:text-brand-sea 2xl:inline-block"
            >
              Fale conosco
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

  if (pathname?.startsWith("/admin-painel")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <DesktopTopHeader isScrolled={isScrolled} activeSection={activeSection} onNavigate={handleNavigate} />
      <DesktopScrolledHeader
        isScrolled={isScrolled}
        activeSection={activeSection}
        onNavigate={handleNavigate}
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
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/contato"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#1fc8c2] hover:bg-[#25dbd4] px-6 py-3 text-sm font-bold text-[#08264e] shadow-sm transition"
                  >
                    Planejar passeio
                  </Link>
                  <a
                    href="https://wa.me/5571992517102"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition"
                  >
                    <span>Fale no WhatsApp</span>
                    <span>💬</span>
                  </a>
                </div>
              </nav>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}
