/**
 * Smooth-scrolls to one of the single page's sections and records it in the URL.
 *
 * Deliberately hand-rolled rather than `href="#id"` + `behavior: "smooth"`:
 * Once UI routes every href through next/link, and the App Router intercepts
 * the click then resets the scroll position, cancelling the scroll. Native
 * smooth scrolling is also unreliable — some engines treat the option as a
 * no-op — so the animation is driven here where it behaves the same everywhere.
 */

const DURATION_MS = 550;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;

  // scroll-margin-top (set in custom.css) keeps headings clear of the header.
  const offset = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const start = window.scrollY;
  const target = Math.min(
    Math.max(section.getBoundingClientRect().top + start - offset, 0),
    maxScroll,
  );
  const distance = target - start;

  // replaceState rather than push: a page of sections shouldn't fill the back
  // button up with scroll positions.
  window.history.replaceState(null, "", `#${id}`);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || Math.abs(distance) < 2) {
    window.scrollTo({ top: target, behavior: "instant" });
    return;
  }

  let startedAt: number | null = null;

  const step = (now: number) => {
    if (startedAt === null) startedAt = now;
    const progress = Math.min((now - startedAt) / DURATION_MS, 1);
    // "instant" so the page's CSS scroll-behavior doesn't animate each step.
    window.scrollTo({ top: start + distance * easeInOutCubic(progress), behavior: "instant" });
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);

  // requestAnimationFrame never fires in a backgrounded tab, which would leave
  // the scroll where it started. If the first frame never ran, just land.
  window.setTimeout(() => {
    if (startedAt === null) {
      window.scrollTo({ top: target, behavior: "instant" });
    }
  }, DURATION_MS + 200);
}
