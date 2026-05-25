"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  aboutStats,
  heroSlides,
  instagramCards,
  routeItems,
  showcaseCards,
  testimonials
} from "@/data/home";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % heroSlides.length);
    }, 6800);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[activeIndex];

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-brand-deep pt-24 text-white sm:pt-28 lg:pt-32"
    >
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className={[
              "absolute inset-0 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              index === activeIndex ? "opacity-100" : "opacity-0"
            ].join(" ")}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div key={activeIndex} aria-hidden="true" className="hero-image-flash absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,29,59,0.76),rgba(8,29,59,0.18)_54%,rgba(8,29,59,0.48))]" />
      <div className={`relative mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-[116rem] items-end px-5 pb-16 sm:px-6 sm:pb-20 lg:min-h-[46rem] lg:px-10 lg:pb-24 xl:px-14 ${plusJakartaSans.className}`}>
        <div className="grid w-full gap-10 md:-translate-y-8 lg:-translate-y-16 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,21rem)] lg:items-end xl:-translate-y-20 xl:gap-14">
          <div className="max-w-[58rem]">
            <div className="mb-6 flex gap-3 text-[#78c85f] sm:mb-8">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "h-3 w-3 rounded-full border transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    index === activeIndex
                      ? "border-[#78c85f] bg-[#78c85f]"
                      : "border-[#78c85f]/40 bg-transparent hover:border-[#78c85f]/70"
                  ].join(" ")}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
            <div key={`hero-title-${activeIndex}`} className="hero-copy-rise hero-copy-delay">
              <h1 className="max-w-[56rem] text-[clamp(3.35rem,8.5vw,7.9rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
                {activeSlide.title}
              </h1>
            </div>
          </div>

          <div className="relative max-w-[21rem] lg:justify-self-end lg:self-end">
            <div key={`hero-side-${activeIndex}`} className="hero-copy-delay hero-copy-fall text-white">
              <div className="rounded-[1.6rem] border border-white/22 bg-white/10 p-2.5 backdrop-blur-md">
                <div className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/8 p-2.5">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[1rem]">
                    <Image
                      src="/images/hero-experience-card.svg"
                      alt="Foto ilustrativa de experiência"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-3xl font-semibold !text-white sm:text-4xl">{activeSlide.stat}</p>
                    <p className="mt-1 max-w-[12rem] text-sm leading-6 !text-white">{activeSlide.statLabel}</p>
                  </div>
                </div>
              </div>
              <p className="mt-5 max-w-[18rem] text-[0.95rem] leading-6 !text-white">
                {activeSlide.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] overflow-hidden">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-24 w-full md:h-28 lg:h-32"
        >
          <path
            fill="#ffffff"
            d="M0 68C24 58 48 48 72 48C96 48 120 58 144 68C168 78 192 88 216 88C240 88 264 78 288 68C312 58 336 48 360 48C384 48 408 58 432 68C456 78 480 88 504 88C528 88 552 78 576 68C600 58 624 48 648 48C672 48 696 58 720 68C744 78 768 88 792 88C816 88 840 78 864 68C888 58 912 48 936 48C960 48 984 58 1008 68C1032 78 1056 88 1080 88C1104 88 1128 78 1152 68C1176 58 1200 48 1224 48C1248 48 1272 58 1296 68C1320 78 1344 88 1368 88C1392 88 1416 78 1440 68V160H0Z"
          />
        </svg>
      </div>
    </section>
  );
}

function HoverRouteList() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  const [previewVector, setPreviewVector] = useState({ x: 0, y: 0 });
  const [previewKey, setPreviewKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const motionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let frameId = 0;

    function animate() {
      setDisplayPosition((current) => {
        const nextX = current.x + (targetPosition.x - current.x) * 0.065;
        const nextY = current.y + (targetPosition.y - current.y) * 0.065;

        return {
          x: Math.abs(nextX - targetPosition.x) < 0.2 ? targetPosition.x : nextX,
          y: Math.abs(nextY - targetPosition.y) < 0.2 ? targetPosition.y : nextY
        };
      });

      frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [targetPosition]);

  function handlePreviewEnter(index: number) {
    const motionX = Math.max(-38, Math.min(38, motionRef.current.x * 1.15));
    const motionY = Math.max(-30, Math.min(30, motionRef.current.y * 1.15));

    setPreviewIndex(index);
    setActiveIndex(index);
    setPreviewVector({ x: motionX, y: motionY });
    setPreviewKey((value) => value + 1);
  }

  return (
    <section
      id="roteiros"
      className="relative overflow-hidden bg-brand-deep py-24 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,34,68,0.92),rgba(9,57,104,0.85)),url('/images/routes-bg.svg')] bg-cover bg-center"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-[-1px] overflow-hidden">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-14 w-full rotate-180 md:h-16 lg:h-20"
        >
          <path
            fill="#ffffff"
            d="M0 68C40 56 80 44 120 44C160 44 200 56 240 68C280 80 320 92 360 92C400 92 440 80 480 68C520 56 560 44 600 44C640 44 680 56 720 68C760 80 800 92 840 92C880 92 920 80 960 68C1000 56 1040 44 1080 44C1120 44 1160 56 1200 68C1240 80 1280 92 1320 92C1360 92 1400 80 1440 68V160H0Z"
          />
        </svg>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] overflow-hidden">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-14 w-full md:h-16 lg:h-20"
        >
          <path
            fill="#ffffff"
            d="M0 68C40 56 80 44 120 44C160 44 200 56 240 68C280 80 320 92 360 92C400 92 440 80 480 68C520 56 560 44 600 44C640 44 680 56 720 68C760 80 800 92 840 92C880 92 920 80 960 68C1000 56 1040 44 1080 44C1120 44 1160 56 1200 68C1240 80 1280 92 1320 92C1360 92 1400 80 1440 68V160H0Z"
          />
        </svg>
      </div>
      <div
        ref={wrapperRef}
        onMouseMove={(event) => {
          const rect = wrapperRef.current?.getBoundingClientRect();
          if (!rect) {
            return;
          }

          const nextPosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          };
          const lastPointer = lastPointerRef.current;

          if (lastPointer) {
            motionRef.current = {
              x: nextPosition.x - lastPointer.x,
              y: nextPosition.y - lastPointer.y
            };
          }

          lastPointerRef.current = nextPosition;

          setTargetPosition(nextPosition);
        }}
        onMouseLeave={() => {
          setActiveIndex(null);
          motionRef.current = { x: 0, y: 0 };
          lastPointerRef.current = null;
        }}
        className="relative mx-auto w-full max-w-6xl px-6"
      >
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white">
              Roteiros em destaque
            </p>
            <h2 className="font-display mt-4 text-[1.8rem] font-semibold tracking-tight text-white md:text-[2.3rem]">
              Experiências Entre as Ilhas
            </h2>
          </div>
          <Link
            href="/passeios"
            className="rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] px-8 py-4 text-sm font-semibold text-white"
          >
            Ver passeios
          </Link>
        </div>

        <div className="space-y-2 border-t border-white/18">
          {routeItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onMouseEnter={() => handlePreviewEnter(index)}
              onFocus={() => handlePreviewEnter(index)}
              onBlur={() => setActiveIndex(null)}
              className="flex w-full flex-col items-start justify-between gap-5 border-b border-white/14 py-7 text-left transition hover:pl-2 sm:flex-row sm:items-center sm:gap-6 sm:py-8"
            >
              <div>
                <p
                  className={[
                    "text-[1.08rem] font-semibold transition md:text-[1.48rem]",
                    activeIndex === index ? "text-brand-leaf" : "text-white"
                  ].join(" ")}
                >
                  {item.title}
                </p>
                <p className="mt-0.5 max-w-2xl text-base text-white">{item.description}</p>
              </div>
              <span
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xl transition sm:h-14 sm:w-14 sm:text-2xl",
                  activeIndex === index
                    ? "border-white bg-white text-brand-tide"
                    : "border-white/28 text-white/88"
                ].join(" ")}
              >
                ↗
              </span>
            </button>
          ))}
        </div>

        <div
          className={[
            "pointer-events-none absolute hidden transition-opacity duration-500 lg:block",
            activeIndex === null ? "opacity-0" : "opacity-100"
          ].join(" ")}
          style={
            {
              left: `${Math.min(Math.max(displayPosition.x - 14, 180), 760)}px`,
              top: `${Math.min(Math.max(displayPosition.y, 230), 720)}px`,
              transform: "translate(0, -50%)"
            } as CSSProperties
          }
        >
          <div
            key={previewKey}
            className="route-preview-enter w-[17rem] rotate-[-9deg] rounded-[2rem] border border-white/16 bg-white/95 p-3 shadow-[0_30px_80px_rgba(9,34,68,0.35)]"
            style={
              {
                "--route-enter-x": `${previewVector.x}px`,
                "--route-enter-y": `${previewVector.y}px`
              } as CSSProperties
            }
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
            <Image
              src={routeItems[previewIndex].image}
              alt={routeItems[previewIndex].title}
              fill
              sizes="272px"
              className="object-cover"
            />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParallaxCard({
  image,
  alt,
  className
}: {
  image: string;
  alt: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId = 0;

    function handleScroll() {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        const rect = cardRef.current?.getBoundingClientRect();
        const imageElement = imageRef.current;

        if (!rect || !imageElement) {
          return;
        }

        const viewportHeight = window.innerHeight;
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const nextOffset = (progress - 0.5) * 170;
        const clampedOffset = Math.max(-105, Math.min(105, nextOffset));

        imageElement.style.transform = `translate3d(0, ${clampedOffset}px, 0) scale(1.08)`;
      });
    }

    function syncPosition() {
      const rect = cardRef.current?.getBoundingClientRect();
      const imageElement = imageRef.current;

      if (!rect) {
        return;
      }

      if (!imageElement) {
        return;
      }

      const viewportHeight = window.innerHeight;
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const nextOffset = (progress - 0.5) * 170;
      const clampedOffset = Math.max(-105, Math.min(105, nextOffset));

      imageElement.style.transform = `translate3d(0, ${clampedOffset}px, 0) scale(1.08)`;
    }

    syncPosition();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", syncPosition);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", syncPosition);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className={[
        "overflow-hidden rounded-[2rem] bg-white p-4 shadow-soft",
        className ?? ""
      ].join(" ")}
      >
        <div className="relative overflow-hidden rounded-[1.55rem]">
          <div
            ref={imageRef}
            className="relative h-[18rem] will-change-transform sm:h-[22rem] md:h-[28rem]"
            style={{ transform: "translate3d(0, 0, 0) scale(1.08)" }}
          >
            <Image src={image} alt={alt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
          </div>
      </div>
    </article>
  );
}

function TestimonialSlider() {
  const cloneSets = 12;
  const loopedTestimonials = Array.from({ length: cloneSets }, () => testimonials).flat();
  const step = 1;
  const [activeDot, setActiveDot] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cardSpan, setCardSpan] = useState(0);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const recenteringRef = useRef(false);
  const baseSetStartRef = useRef(0);

  useEffect(() => {
    function measureCardSpan() {
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }

      const firstCard = viewport.querySelector("[data-testimonial-card]") as HTMLElement | null;
      if (!firstCard) {
        return;
      }

      const track = viewport.querySelector("[data-testimonial-track]") as HTMLElement | null;
      if (!track) {
        return;
      }

      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const nextSpan = firstCard.getBoundingClientRect().width + gap;
      const setWidth = nextSpan * testimonials.length;
      const baseOffset = setWidth * Math.floor(cloneSets / 2);

      setCardSpan(nextSpan);
      baseSetStartRef.current = baseOffset;

      if (!viewport.scrollLeft || Math.abs(viewport.scrollLeft - baseOffset) > setWidth * 2) {
        viewport.scrollLeft = baseOffset;
      }
    }

    measureCardSpan();
    window.addEventListener("resize", measureCardSpan);

    return () => window.removeEventListener("resize", measureCardSpan);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  function animateScrollTo(targetLeft: number, duration = 2000) {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    if (scrollAnimationRef.current) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
    }

    const startLeft = viewport.scrollLeft;
    const delta = targetLeft - startLeft;
    const startTime = performance.now();

    function stepFrame(now: number) {
      const nextViewport = viewportRef.current;
      if (!nextViewport) {
        scrollAnimationRef.current = null;
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      nextViewport.scrollLeft = startLeft + delta * eased;

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(stepFrame);
      } else {
        scrollAnimationRef.current = null;
      }
    }

    scrollAnimationRef.current = window.requestAnimationFrame(stepFrame);
  }

  useEffect(() => {
    if (!cardSpan) {
      return;
    }

    function startAutoPlay() {
      if (autoTimerRef.current) {
        window.clearInterval(autoTimerRef.current);
      }

      autoTimerRef.current = window.setInterval(() => {
        const viewport = viewportRef.current;
        if (!viewport || isDragging) {
          return;
        }

        animateScrollTo(viewport.scrollLeft + cardSpan * step);
        }, 4000);
      }

    startAutoPlay();

    return () => {
      if (autoTimerRef.current) {
        window.clearInterval(autoTimerRef.current);
      }
    };
  }, [isDragging, cardSpan]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !cardSpan) {
      return;
    }

    const setWidth = cardSpan * testimonials.length;
    const minScroll = setWidth * 2;
    const maxScroll = setWidth * (cloneSets - 3);

    function handleScroll() {
      const nextViewport = viewportRef.current;
      if (!nextViewport) {
        return;
      }

      if (recenteringRef.current) {
        return;
      }

      const current = nextViewport.scrollLeft;

      if (current < minScroll) {
        recenteringRef.current = true;
        nextViewport.scrollLeft = current + setWidth * 4;
        recenteringRef.current = false;
      } else if (current > maxScroll) {
        recenteringRef.current = true;
        nextViewport.scrollLeft = current - setWidth * 4;
        recenteringRef.current = false;
      }

      const normalized = Math.round(nextViewport.scrollLeft / cardSpan) % testimonials.length;
      setActiveDot((normalized + testimonials.length) % testimonials.length);
    }

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [cardSpan]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    if (scrollAnimationRef.current) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }

    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = viewport.scrollLeft;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const delta = event.clientX - dragStartXRef.current;
    viewport.scrollLeft = dragStartScrollRef.current - delta;
  }

  function finishDrag(target: HTMLDivElement | null) {
    const viewport = viewportRef.current;
    if (viewport && cardSpan) {
      const snappedIndex = Math.round(viewport.scrollLeft / cardSpan);
      animateScrollTo(snappedIndex * cardSpan);
    }

    if (target && pointerIdRef.current !== null) {
      try {
        target.releasePointerCapture(pointerIdRef.current);
      } catch {}
    }

    pointerIdRef.current = null;
    setIsDragging(false);
  }

  return (
    <section id="avaliacoes" className="relative overflow-hidden bg-white py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,152,213,0.08),_transparent_34%)]"
      />
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-sea">
                Avaliações
              </p>
              <h2 className="mt-4 text-[clamp(2.2rem,5vw,3rem)] font-semibold tracking-tight text-brand-deep">
                Feedbacks de viajantes
              </h2>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              {testimonials.map((testimonial, itemIndex) => (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => {
                    const viewport = viewportRef.current;
                    if (!viewport || !cardSpan) {
                      return;
                    }

                    animateScrollTo(baseSetStartRef.current + itemIndex * cardSpan);
                  }}
                  className={[
                    "h-3 rounded-full transition-all duration-300",
                    activeDot === itemIndex ? "w-8 bg-brand-sea" : "w-3 bg-brand-sea/25"
                  ].join(" ")}
                  aria-label={`Ir para depoimento ${itemIndex + 1}`}
                />
              ))}
            </div>
          </div>

          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => finishDrag(event.currentTarget)}
            onPointerCancel={(event) => finishDrag(event.currentTarget)}
            className={[
              "overflow-hidden rounded-[2.2rem]",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            ].join(" ")}
              style={{ touchAction: "pan-y" }}
            >
              <div
                className="flex gap-6"
                data-testimonial-track
              >
                {loopedTestimonials.map((testimonial, itemIndex) => (
                  <article
                    key={`${testimonial.name}-${itemIndex}`}
                    data-testimonial-card
                    className="w-full shrink-0 basis-full rounded-[1.9rem] bg-brand-foam p-4 shadow-soft md:basis-[calc((100%-1.5rem)/2)] md:p-6"
                  >
                  <div className="grid gap-5 md:grid-cols-[0.38fr_0.62fr] md:items-stretch">
                    <div className="relative h-[16rem] overflow-hidden rounded-[1.35rem] md:h-[19rem]">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="flex flex-col justify-between rounded-[1.35rem] bg-white p-5 md:p-6">
                      <div>
                        <p className="text-2xl font-semibold text-brand-deep md:text-[1.7rem]">
                          {testimonial.name}
                        </p>
                        <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-brand-sea md:text-[0.8rem]">
                          {testimonial.role}
                        </p>
                      </div>
                      <p className="mt-5 text-base leading-7 text-slate-600 md:text-[1.12rem] md:leading-8">
                        “{testimonial.quote}”
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 md:hidden">
            {testimonials.map((testimonial, itemIndex) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => {
                  const viewport = viewportRef.current;
                  if (!viewport || !cardSpan) {
                    return;
                  }

                  animateScrollTo(baseSetStartRef.current + itemIndex * cardSpan);
                }}
                className={[
                  "h-3 rounded-full transition-all duration-300",
                  activeDot === itemIndex ? "w-8 bg-brand-sea" : "w-3 bg-brand-sea/25"
                ].join(" ")}
                aria-label={`Ir para depoimento ${itemIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

function Chamada() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = titleRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-deep py-24 text-white sm:py-28 md:py-36 lg:py-44">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,34,68,0.92),rgba(9,57,104,0.85)),url('/images/routes-bg.svg')] bg-cover bg-center"
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
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] overflow-hidden">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-24 w-full md:h-28 lg:h-32"
        >
          <path
            fill="#ffffff"
            d="M0 68C24 58 48 48 72 48C96 48 120 58 144 68C168 78 192 88 216 88C240 88 264 78 288 68C312 58 336 48 360 48C384 48 408 58 432 68C456 78 480 88 504 88C528 88 552 78 576 68C600 58 624 48 648 48C672 48 696 58 720 68C744 78 768 88 792 88C816 88 840 78 864 68C888 58 912 48 936 48C960 48 984 58 1008 68C1032 78 1056 88 1080 88C1104 88 1128 78 1152 68C1176 58 1200 48 1224 48C1248 48 1272 58 1296 68C1320 78 1344 88 1368 88C1392 88 1416 78 1440 68V160H0Z"
          />
        </svg>
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-center md:py-24">
        <h3 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[0.12em] text-white">
          Venha viver
        </h3>
        <h2
          ref={titleRef}
          className={[
            "title-flip-fade mx-auto mt-2 max-w-[12ch] text-balance text-[clamp(3rem,10vw,7.25rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white sm:mt-0",
            isVisible ? "is-visible" : ""
          ].join(" ")}
        >
          Entre as Ilhas!
        </h2>
      </div>
    </section>
  );
}

export function HomeLanding() {
  return (
    <div className="overflow-hidden bg-white">
      <HeroSlider />

      <section id="sobre" className="relative bg-white pb-14 pt-10 md:pb-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="grid gap-8">
            <article className="relative overflow-hidden rounded-[2.2rem]">
              <div className="absolute inset-0 rounded-[2.2rem] border-[3px] border-brand-sea" />
              <div className="relative m-7 overflow-hidden rounded-[2rem]">
                <Image
                  src="/images/about-main.svg"
                  alt="Imagem principal da seção sobre"
                  width={780}
                  height={900}
                  className="h-auto w-full"
                />
              </div>
            </article>

            <div className="pl-0 sm:pl-4 md:pl-8">
              <p className="text-lg font-semibold text-brand-sea">Quem somos</p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:mt-8 md:text-xl md:leading-10">
                Organizamos experiências náuticas e roteiros costeiros com foco em
                conforto, clareza logística e visual tropical.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                {aboutStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-full bg-brand-foam px-5 py-3 text-brand-deep"
                  >
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <p className="text-sm text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-lg font-semibold text-brand-sea">
              Mergulhe na magia do mar
            </p>
            <h2 className="font-display mt-5 text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-tight text-brand-deep">
              Explorando a beleza entre ondas, ilhas e marés.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:mt-8 md:text-xl md:leading-10">
              A proposta visual segue a mesma lógica da referência: título amplo,
              foto principal recortada, apoio fotográfico secundário e conteúdo
              bem respirado logo após a hero.
            </p>
            <Link
              href="/sobre"
              className="mt-10 inline-flex rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] px-8 py-4 text-base font-semibold text-white"
            >
              Conhecer a agência
            </Link>
            <div className="mt-14 overflow-hidden rounded-[2.2rem]">
              <Image
                src="/images/about-secondary.svg"
                alt="Imagem secundária da seção sobre"
                width={980}
                height={640}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white pb-16 pt-8 sm:pb-20 sm:pt-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#9ce5f1_50%,#ffffff_100%)]"
        />
        <div className="relative mx-auto h-[19rem] w-full max-w-7xl px-4 sm:h-[24rem] md:h-[34rem]">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[14%] h-[22%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),transparent_62%)] blur-3xl"
          />
          <div
            className="absolute z-10 overflow-hidden"
            style={{ left: "-40vw", right: "-40vw", top: "39%", bottom: "-5rem" }}
          >
            <div className="absolute inset-0 -top-4 ocean-wave ocean-wave-back" />
          </div>
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="absolute rounded-full border border-white/80"
              style={{
                width: `${index % 3 === 0 ? 18 : index % 3 === 1 ? 10 : 5}px`,
                height: `${index % 3 === 0 ? 18 : index % 3 === 1 ? 10 : 5}px`,
                left: `${(index * 13) % 96}%`,
                bottom: `${18 + ((index * 9) % 68)}px`,
                opacity: index % 4 === 0 ? 0.9 : 0.5
              }}
            />
          ))}
          <div className="absolute left-1/2 top-[39.5%] z-20 -translate-x-1/2 -translate-y-1/2 sm:top-[39%] md:top-[37.75%]">
            <div className="relative h-28 w-56 animate-boat sm:h-40 sm:w-80 md:h-64 md:w-[32rem]">
              <Image
                src="/images/barco.png"
                alt="Barco flutuando"
                fill
                sizes="288px"
                className="object-contain -scale-x-100"
              />
            </div>
          </div>
          <div
            className="absolute z-30 pointer-events-none overflow-hidden"
            style={{ left: "-40vw", right: "-40vw", top: "39%", bottom: "-5rem" }}
          >
            <div className="absolute inset-0 top-[-0.15rem] ocean-wave ocean-wave-front" />
          </div>
        </div>
      </section>

      <HoverRouteList />

      <section id="galeria" className="bg-white py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-sea">
              Adventure Showcase
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.3rem,6vw,3.75rem)] font-semibold tracking-tight text-brand-deep">
              Galeria com recortes grandes e parallax dentro da moldura.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.46fr_0.54fr]">
            <div className="grid gap-6">
              <ParallaxCard
                image={showcaseCards[0].image}
                alt={showcaseCards[0].title}
                className="max-w-[34rem] lg:max-w-[34rem]"
              />
              <ParallaxCard
                image={showcaseCards[2].image}
                alt={showcaseCards[2].title}
                className="max-w-[42rem] lg:max-w-[42rem]"
              />
            </div>
            <div className="grid gap-6 pt-0 lg:pt-10">
              <ParallaxCard
                image={showcaseCards[1].image}
                alt={showcaseCards[1].title}
              />
              <ParallaxCard
                image={showcaseCards[3].image}
                alt={showcaseCards[3].title}
                className="max-w-[34rem] justify-self-end"
              />
            </div>
          </div>
        </div>
      </section>

      <TestimonialSlider />
      <Chamada />

      <section id="instagram" className="bg-white py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-sea">
                Instagram
              </p>
              <h2 className="font-display mt-4 text-[clamp(2.3rem,6vw,3.75rem)] font-semibold tracking-tight text-brand-deep">
                Últimos posts de @entreasilhas
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl md:leading-9">
                Área preparada para futura integração em tempo real com a rede
                social. Por enquanto, a estrutura visual e responsiva já está pronta.
              </p>
            </div>
            <a
              href="https://instagram.com/entreasilhas"
              className="rounded-full bg-brand-deep px-8 py-4 text-base font-semibold text-white"
            >
              Abrir perfil
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instagramCards.map((card) => (
              <article
                key={card.label}
                className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-soft transition duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-brand-deep">{card.label}</p>
                  <span className="rounded-full bg-brand-foam px-3 py-1 text-sm text-brand-sea">
                    Instagram
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
