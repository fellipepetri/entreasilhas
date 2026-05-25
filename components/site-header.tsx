"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { primaryNavigationLinks } from "@/data/home";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"]
});

const navigationSectionIds = primaryNavigationLinks.map((link) =>
  link.href === "/" ? "inicio" : link.href.replace("#", "")
);

function getSectionIdFromHref(href: string) {
  return href === "/" ? "inicio" : href.replace("#", "");
}

function BrandMark({ scrolled, compact = false }: { scrolled: boolean; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={[
        "flex min-w-0 items-center gap-3",
        compact ? plusJakartaSans.className : ""
      ].join(" ")}
    >
      <div
        className={[
          "relative shrink-0 overflow-hidden",
          compact ? "h-9 w-9" : "h-11 w-11"
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
            ? "hidden whitespace-nowrap text-[1.75rem] font-semibold leading-none tracking-[-0.04em] transition-colors duration-300 xl:inline-block"
            : "hidden whitespace-nowrap text-[2.15rem] font-semibold leading-none tracking-[-0.04em] transition-colors duration-300 2xl:inline-block",
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
  onNavigate: (href: string) => void;
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
        <div className={`top-header-shell pointer-events-auto flex min-h-[4.05rem] flex-1 items-center justify-between gap-6 rounded-[2.4rem] border border-transparent px-5 shadow-[0_24px_80px_rgba(6,28,57,0.32)] backdrop-blur-xl ${plusJakartaSans.className}`}>
          <BrandMark scrolled={false} compact />
          <nav className="mr-2 flex items-center gap-6 2xl:gap-10" aria-label="Principal">
            {primaryNavigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onNavigate(link.href)}
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

        <div className={`top-header-shell pointer-events-auto flex min-h-[4.05rem] items-center gap-5 rounded-[2.4rem] border border-transparent px-5 shadow-[0_24px_80px_rgba(6,28,57,0.32)] backdrop-blur-xl ${plusJakartaSans.className}`}>
          <a href="http://wa.me/5571992517102" className="text-[0.89rem] font-semibold text-white">
            Fale conosco
          </a>
          <Link
            href="/contato"
            className="rounded-full bg-[#1fc8c2] px-7 py-2.5 text-[0.89rem] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-surf"
          >
            Planejar passeio
          </Link>
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
  onNavigate: (href: string) => void;
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
        <div className="mx-auto flex min-h-[5.25rem] w-full max-w-[116rem] items-center justify-between gap-6 px-8 xl:px-10 2xl:px-12">
          <BrandMark scrolled />

          <nav className="flex items-center gap-7 2xl:gap-12" aria-label="Principal fixo">
            {primaryNavigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onNavigate(link.href)}
                className={[
                  "text-[1.02rem] font-medium transition",
                  activeSection === getSectionIdFromHref(link.href)
                    ? "text-brand-sea"
                    : "text-brand-deep hover:text-brand-sea"
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <a
              href="tel:+5571999999999"
              className="hidden text-[1.05rem] font-semibold text-brand-deep 2xl:inline-block"
            >
              +55 (71) 99999-9999
            </a>
            <Link
              href="/contato"
              className="rounded-full bg-[#1fc8c2] px-8 py-3 text-[1.05rem] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-surf"
            >
              Planejar passeio
            </Link>
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

  function handleNavigate(href: string) {
    setActiveSection(getSectionIdFromHref(href));
  }

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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <DesktopTopHeader isScrolled={isScrolled} activeSection={activeSection} onNavigate={handleNavigate} />
      <DesktopScrolledHeader
        isScrolled={isScrolled}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <div className="px-4 pt-4 xl:hidden">
        <div
          className={[
            "mx-auto flex items-center justify-between gap-4 rounded-[2rem] border px-5 py-3.5 transition-all duration-500",
            isScrolled
              ? "border-brand-deep/8 bg-white/96 shadow-[0_18px_45px_rgba(10,40,79,0.12)]"
              : "border-white/30 bg-[linear-gradient(135deg,rgba(10,40,79,0.74),rgba(20,72,117,0.62))] backdrop-blur-xl"
          ].join(" ")}
        >
          <BrandMark scrolled={isScrolled} />

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className={[
              "inline-flex h-11 w-11 items-center justify-center rounded-full border",
              isScrolled
                ? "border-brand-deep/12 bg-brand-foam text-brand-deep"
                : "border-white/30 bg-white/10 text-white"
            ].join(" ")}
            aria-label="Abrir menu"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        {isOpen ? (
          <div className="mx-auto mt-3 rounded-[1.8rem] border border-brand-deep/8 bg-white/96 p-5 shadow-soft backdrop-blur">
            <nav className="flex flex-col gap-4" aria-label="Mobile">
              {primaryNavigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    handleNavigate(link.href);
                    setIsOpen(false);
                  }}
                  className={[
                    "text-sm font-medium transition",
                    activeSection === getSectionIdFromHref(link.href)
                      ? "text-brand-sea"
                      : "text-brand-deep"
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contato"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex w-fit rounded-full bg-[#1fc8c2] px-6 py-3 text-sm font-semibold text-white"
              >
                Planejar passeio
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
