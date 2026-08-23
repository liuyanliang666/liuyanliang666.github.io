"use client";

import { useEffect } from "react";
import { scrollToSection } from "./scrollToSection";

/**
 * Honours a `#section` hash on load, so links like /#projects from a project
 * page land in the right place.
 */
export function ScrollToHash() {
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id) scrollToSection(id);
  }, []);

  return null;
}
