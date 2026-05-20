"use client";

import { useEffect, useRef } from "react";

const BUBBLE_COUNT = 18;

export function CursorTrails() {
  const bubbleRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let bubbleIndex = 0;
    let lastEmit = 0;
    let isPressed = false;

    function emitBubble(clientX: number, clientY: number, intensity = 1) {
      const bubble = bubbleRefs.current[bubbleIndex];
      bubbleIndex = (bubbleIndex + 1) % BUBBLE_COUNT;

      if (!bubble) {
        return;
      }

      const size = 10 + Math.random() * 16 * intensity;
      const driftX = (Math.random() - 0.5) * 38;
      const driftY = -22 - Math.random() * 30;
      const duration = 850 + Math.random() * 520;
      const ring = Math.random() > 0.45 ? 1 : 0;
      const glow = Math.random() > 0.35 ? 1 : 0;
      const opacity = 0.22 + Math.random() * 0.26;

      bubble.style.setProperty("--bubble-x", `${clientX}px`);
      bubble.style.setProperty("--bubble-y", `${clientY}px`);
      bubble.style.setProperty("--bubble-size", `${size}px`);
      bubble.style.setProperty("--bubble-drift-x", `${driftX}px`);
      bubble.style.setProperty("--bubble-drift-y", `${driftY}px`);
      bubble.style.setProperty("--bubble-duration", `${duration}ms`);
      bubble.style.setProperty("--bubble-opacity", `${opacity}`);
      bubble.dataset.ring = `${ring}`;
      bubble.dataset.glow = `${glow}`;
      bubble.classList.remove("cursor-bubble-pop");
      void bubble.offsetWidth;
      bubble.classList.add("cursor-bubble-pop");
    }

    function handlePointerMove(event: PointerEvent) {
      const now = performance.now();
      const elapsed = now - lastEmit;

      if (elapsed < 34) {
        return;
      }

      lastEmit = now;
      emitBubble(event.clientX, event.clientY, isPressed ? 1.18 : 1);
    }

    function handlePointerDown(event: PointerEvent) {
      isPressed = true;
      emitBubble(event.clientX, event.clientY, 1.35);
      window.setTimeout(() => {
        emitBubble(event.clientX + 6, event.clientY - 2, 1.18);
      }, 40);
    }

    function handlePointerUp() {
      isPressed = false;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-trails">
      {Array.from({ length: BUBBLE_COUNT }).map((_, index) => (
        <span
          key={index}
          ref={(node) => {
            bubbleRefs.current[index] = node;
          }}
          className="cursor-bubble"
        />
      ))}
    </div>
  );
}
