"use client";

import { useEffect, useRef } from "react";

import { Flex } from "@once-ui-system/core";

type CursorSpotlightProps = {
  cursor?: boolean;
  radius: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
};

// Once UI's own cursor-tracking Mask smooths toward the pointer over several
// animation frames, which reads as lag. This tracks the pointer directly
// (still batched to one write per frame) so the spotlight feels attached to
// the cursor instead of trailing it.
export function CursorSpotlight({ cursor = false, radius, x = 50, y = 0, children }: CursorSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !cursor) return;

    const rect = el.getBoundingClientRect();
    const client = { x: rect.left + (rect.width * x) / 100, y: rect.top + (rect.height * y) / 100 };

    const handleMove = (event: MouseEvent) => {
      client.x = event.clientX;
      client.y = event.clientY;
    };
    document.addEventListener("mousemove", handleMove, { passive: true });

    // el is fixed to the viewport, so its box never shifts on scroll — bounds
    // are re-read each frame only to stay correct across resizes, not scroll.
    let frame = requestAnimationFrame(function tick() {
      const bounds = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-x", `${client.x - bounds.left}px`);
      el.style.setProperty("--spotlight-y", `${client.y - bounds.top}px`);
      frame = requestAnimationFrame(tick);
    });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [cursor, x, y]);

  return (
    <Flex
      ref={ref}
      position="fixed"
      fill
      top="0"
      left="0"
      zIndex={0}
      overflow="hidden"
      style={{
        maskImage: `radial-gradient(${radius}vh at var(--spotlight-x, ${x}%) var(--spotlight-y, ${y}%), black 0%, transparent 100%)`,
        WebkitMaskImage: `radial-gradient(${radius}vh at var(--spotlight-x, ${x}%) var(--spotlight-y, ${y}%), black 0%, transparent 100%)`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }}
    >
      {children}
    </Flex>
  );
}
