"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { Column, Heading, RevealFx, Text } from "@once-ui-system/core";
import styles from "./QuoteTypewriter.module.scss";

// A characterful serif for the quote, set apart from the site's sans-serif body copy.
const quoteFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
});

type Quote = { text: string; author: string };
type Phase = "typing" | "holding" | "deleting";
type SizedQuote = Quote & { fontSize: number; authorFontSize: number };

const TYPE_MS = 58;
const DELETE_MS = 26;
const HOLD_MS = 2600;
const PAUSE_MS = 500;
const REDUCED_MOTION_HOLD_MS = 4200;
// Long quotes are allowed to wrap up to this many lines instead of shrinking
// down to fit on one.
const MAX_LINES = 2;
// The reserved height is one line taller than MAX_LINES: as a quote types out
// character by character, text-wrap:balance can rebalance a partial line into
// one more line than the finished quote ultimately needs before settling back
// down — this buffer absorbs that transient so the sections below never shift.
const RESERVED_LINES = MAX_LINES + 1;
const LINE_HEIGHT_EM = 1.1;
const MIN_FONT_SIZE_PX = 16;
const MIN_AUTHOR_FONT_SIZE_PX = 17;
// Leaves a little breathing room so rounding/font-metric differences between
// the measuring clone and the real heading can't tip a quote onto an extra line.
const FIT_SAFETY_MARGIN = 0.97;

interface QuoteTypewriterProps {
  quotes: Quote[];
}

// Splits `text` on hyphens, keeping the hyphen characters, and marks how much
// of each piece has been "typed" so far. Hyphens render upright — in this
// italic face a slanted hyphen reads as a stray diagonal stroke rather than a
// dash — while everything else keeps the surrounding italic style. The
// not-yet-typed remainder of each piece stays in the DOM (just invisible)
// rather than omitted, so text-wrap:balance always wraps and centers each
// line against the quote's full, final text: a line still being typed would
// otherwise re-center around its own shorter, growing width and visibly
// drift as each character lands. The blinking cursor (a border) attaches to
// whichever piece the typed length currently ends within.
function renderTypedQuote(text: string, revealedLength: number) {
  const pieces = text.split(/(-)/);
  const nodes: ReactNode[] = [];
  let pos = 0;
  let cursorPlaced = false;

  pieces.forEach((piece, i) => {
    const start = pos;
    const end = pos + piece.length;
    pos = end;
    if (!piece) return;

    const revealedEnd = Math.max(start, Math.min(end, revealedLength));
    const revealedPart = text.slice(start, revealedEnd);
    const hiddenPart = text.slice(revealedEnd, end);
    const placeCursorHere = !cursorPlaced && revealedLength <= end;
    if (placeCursorHere) cursorPlaced = true;

    const hyphenStyle = piece === "-" ? { fontStyle: "normal" as const } : undefined;

    if (revealedPart || placeCursorHere) {
      nodes.push(
        <span
          key={`r${i}`}
          className={placeCursorHere ? styles.typedText : undefined}
          style={hyphenStyle}
        >
          {revealedPart}
        </span>,
      );
    }
    if (hiddenPart) {
      nodes.push(
        <span key={`h${i}`} style={{ visibility: "hidden", ...hyphenStyle }} aria-hidden="true">
          {hiddenPart}
        </span>,
      );
    }
  });

  return nodes;
}

// Same upright-hyphen treatment for the static (prefers-reduced-motion) case,
// where the full quote is shown at once with no cursor or reveal animation.
function renderStaticQuote(text: string) {
  return text.split(/(-)/).map((piece, i) =>
    piece === "-" ? (
      <span key={i} style={{ fontStyle: "normal" }}>
        -
      </span>
    ) : (
      piece
    ),
  );
}

// Cycles through `quotes` forever, typing each one out letter by letter and
// deleting it before moving to the next. Every quote shares one font size —
// sized so the widest of them still fits within MAX_LINES lines — and the
// heading reserves exactly that much height, so the hero's height never
// changes and nothing below it shifts as quotes cycle through. Respects
// prefers-reduced-motion by swapping quotes with a plain crossfade instead of
// animating each keystroke.
export function QuoteTypewriter({ quotes }: QuoteTypewriterProps) {
  const [sizedQuotes, setSizedQuotes] = useState<SizedQuote[]>(
    quotes.map((quote) => ({ ...quote, fontSize: 0, authorFontSize: 0 })),
  );
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const reducedMotion = useRef(false);
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const authorWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const heading = headingWrapRef.current?.querySelector("h1");
    const author = authorWrapRef.current?.querySelector("span");
    if (!heading || !author) return;

    const fit = () => {
      const availableWidth = headingWrapRef.current?.getBoundingClientRect().width;
      if (!availableWidth) return;

      const baseFontSize = parseFloat(getComputedStyle(heading).fontSize);
      const baseAuthorFontSize = parseFloat(getComputedStyle(author).fontSize);

      const clone = heading.cloneNode(false) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.minHeight = "0";
      clone.style.width = `${availableWidth}px`;
      heading.parentElement?.appendChild(clone);

      // Actually renders each quote wrapped at a candidate font size and reads
      // its real height — a word-wrapped paragraph doesn't pack to a clean
      // width*lines budget, so this is measured directly rather than estimated.
      const fitsWithinMaxLines = (fontSizePx: number) => {
        clone.style.fontSize = `${fontSizePx}px`;
        const maxHeight = fontSizePx * LINE_HEIGHT_EM * MAX_LINES + 1;
        return quotes.every((quote) => {
          clone.textContent = quote.text;
          return clone.getBoundingClientRect().height <= maxHeight;
        });
      };

      let fontSize = baseFontSize;
      if (!fitsWithinMaxLines(baseFontSize)) {
        let lo = MIN_FONT_SIZE_PX;
        let hi = baseFontSize;
        for (let i = 0; i < 14; i++) {
          const mid = (lo + hi) / 2;
          if (fitsWithinMaxLines(mid)) lo = mid;
          else hi = mid;
        }
        fontSize = lo;
      }
      clone.remove();

      fontSize = Math.max(MIN_FONT_SIZE_PX, fontSize * FIT_SAFETY_MARGIN);
      const authorFontSize = Math.max(
        MIN_AUTHOR_FONT_SIZE_PX,
        Math.min(baseAuthorFontSize, baseAuthorFontSize * (fontSize / baseFontSize)),
      );

      setSizedQuotes(quotes.map((quote) => ({ ...quote, fontSize, authorFontSize })));
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [quotes]);

  useEffect(() => {
    if (reducedMotion.current) {
      const id = window.setInterval(() => {
        setIndex((current) => (current + 1) % sizedQuotes.length);
      }, REDUCED_MOTION_HOLD_MS);
      return () => window.clearInterval(id);
    }

    const full = sizedQuotes[index].text;
    let timeout: number;

    if (phase === "typing") {
      timeout =
        length < full.length
          ? window.setTimeout(() => setLength((current) => current + 1), TYPE_MS)
          : window.setTimeout(() => setPhase("holding"), PAUSE_MS);
    } else if (phase === "holding") {
      timeout = window.setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else {
      timeout =
        length > 0
          ? window.setTimeout(() => setLength((current) => current - 1), DELETE_MS)
          : window.setTimeout(() => {
              setIndex((current) => (current + 1) % sizedQuotes.length);
              setPhase("typing");
            }, PAUSE_MS);
    }

    return () => window.clearTimeout(timeout);
  }, [phase, length, index, sizedQuotes]);

  const current = sizedQuotes[index];
  const authorVisible = reducedMotion.current || phase === "holding";

  return (
    <>
      <Column ref={headingWrapRef} maxWidth="m" horizontal="center" align="center">
        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
          <Heading
            wrap="balance"
            variant="display-strong-l"
            style={{
              fontSize: current.fontSize ? `${current.fontSize}px` : undefined,
              fontFamily: quoteFont.style.fontFamily,
              fontStyle: "italic",
              fontWeight: 600,
              lineHeight: LINE_HEIGHT_EM,
              // A block element's content starts at its top by default, so
              // reserving extra height here already anchors text to the top —
              // no flex/centering needed, which also keeps the cursor span
              // (a border on this text) a genuinely inline, per-line element.
              minHeight: `${RESERVED_LINES * LINE_HEIGHT_EM}em`,
              width: "100%",
            }}
          >
            {reducedMotion.current
              ? renderStaticQuote(current.text)
              : renderTypedQuote(current.text, length)}
          </Heading>
        </RevealFx>
      </Column>
      <Column ref={authorWrapRef} maxWidth="m" horizontal="end" align="right" paddingRight="8">
        <RevealFx translateY="8" delay={0.2} fillWidth horizontal="end" paddingBottom="32">
          <Text
            onBackground="neutral-weak"
            variant="heading-default-xl"
            className={styles.author}
            style={{
              opacity: authorVisible ? 1 : 0,
              fontSize: current.authorFontSize ? `${current.authorFontSize}px` : undefined,
              fontFamily: quoteFont.style.fontFamily,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            — {current.author}
          </Text>
        </RevealFx>
      </Column>
    </>
  );
}
