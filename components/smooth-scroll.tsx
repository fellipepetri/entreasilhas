"use client";

import { useEffect } from "react";

const EASING = 0.052;
const WHEEL_STEP = 0.82;

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, option, [contenteditable='true'], [data-native-scroll='true']"
    )
  );
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

    function maxScrollY() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function tick() {
      currentY += (targetY - currentY) * EASING;

      if (Math.abs(targetY - currentY) < 0.5) {
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

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || isInteractiveElement(event.target)) {
        return;
      }

      event.preventDefault();

      const delta = event.deltaMode === 1 ? event.deltaY * 18 : event.deltaY;
      targetY = Math.max(0, Math.min(targetY + delta * WHEEL_STEP, maxScrollY()));
      startAnimation();
    }

    function handleResize() {
      targetY = Math.max(0, Math.min(targetY, maxScrollY()));
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
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", syncScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", syncScrollPosition);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
