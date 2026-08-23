"use client";

import { useEffect, useRef, useState } from "react";
import { RevealFx } from "@once-ui-system/core";

interface RevealOnScrollProps {
  children: React.ReactNode;
  /** Distance the block travels while fading in, in Once UI spacing units. */
  translateY?: number;
  delay?: number;
}

/**
 * The same reveal the hero uses, held back until the block scrolls into view.
 *
 * RevealFx reveals itself on mount, so it can't be driven by its `trigger` prop
 * alone — the block is kept in the layout but hidden until the observer fires,
 * then RevealFx mounts and plays its normal entrance.
 */
export function RevealOnScroll({ children, translateY = 8, delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Honour the OS reduce-motion setting by skipping straight to the end state.
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      // Start a little before the block is fully in frame.
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);

    // Content must never be able to get stuck invisible — an observer that
    // never fires (zero-size viewport, throttled background tab) would do
    // exactly that. Reveal anyway if nothing has happened by then.
    const failsafe = window.setTimeout(() => setRevealed(true), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div ref={ref} style={{ width: "100%" }}>
      {revealed ? (
        <RevealFx translateY={translateY} delay={delay} speed="fast">
          {children}
        </RevealFx>
      ) : (
        <div style={{ visibility: "hidden" }}>{children}</div>
      )}
    </div>
  );
}
