"use client";

import { Button } from "@once-ui-system/core";
import { scrollToSection } from "./scrollToSection";

interface ScrollButtonProps {
  /** id of the section to scroll to. */
  sectionId: string;
  children: React.ReactNode;
}

/** The hero call-to-action: scrolls down the page instead of navigating. */
export function ScrollButton({ sectionId, children }: ScrollButtonProps) {
  return (
    <Button
      data-border="rounded"
      onClick={() => scrollToSection(sectionId)}
      variant="secondary"
      size="m"
      weight="default"
      arrowIcon
    >
      {children}
    </Button>
  );
}
