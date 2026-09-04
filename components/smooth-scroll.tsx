"use client";

import { useEffect } from "react";

const EASING = 0.04;
const MAX_WHEEL_DELTA = 140;
const STOP_THRESHOLD = 0.25;
const SCROLLABLE_SELECTOR = [
  "input",
  "textarea",
  "select",
  "option",
  "[contenteditable='true']",
  "[data-native-scroll='true']"
].join(", ");

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest(SCROLLABLE_SELECTOR));
}

function hasScrollableParent(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  let element: HTMLElement | null = target;

  while (element && element !== document.body && element !== document.documentElement) {
    const style = window.getComputedStyle(element);
    const canScrollY =
      /(auto|scroll|overlay)/.test(style.overflowY) && element.scrollHeight > element.clientHeight;

    if (canScrollY) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}

function normalizeWheelDelta(event: WheelEvent) {
  const unit =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 36
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;

  const delta = event.deltaY * unit;

  return Math.max(-MAX_WHEEL_DELTA, Math.min(delta, MAX_WHEEL_DELTA));
}

export function SmoothScroll() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let rafId = 0;
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";

    function maxScrollY() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function clampScrollY(value: number) {
      return Math.max(0, Math.min(value, maxScrollY()));
    }

    function tick() {
      currentY += (targetY - currentY) * EASING;

      if (Math.abs(targetY - currentY) < STOP_THRESHOLD) {
        currentY = targetY;
      }

      window.scrollTo(0, currentY);

      if (currentY !== targetY) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }

    function startAnimation() {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    }

    function animateTo(nextY: number) {
      targetY = clampScrollY(nextY);
      startAnimation();
    }

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || isInteractiveElement(event.target) || hasScrollableParent(event.target)) {
        return;
      }

      event.preventDefault();

      animateTo(targetY + normalizeWheelDelta(event));
    }

    function handleAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      const link = event.target instanceof Element ? event.target.closest("a[href^='#']") : null;
      const hash = link instanceof HTMLAnchorElement ? link.hash : "";

      if (!hash || hash === "#") {
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));

      if (!target) {
        return;
      }

      event.preventDefault();
      history.pushState(null, "", hash);
      animateTo(window.scrollY + target.getBoundingClientRect().top);
    }

    function handleResize() {
      targetY = clampScrollY(targetY);
      currentY = window.scrollY;
    }

    function syncScrollPosition() {
      if (rafId) {
        return;
      }

      currentY = window.scrollY;
      targetY = window.scrollY;
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", syncScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", syncScrollPosition);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
