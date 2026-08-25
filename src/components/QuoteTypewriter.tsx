"use client";

import { useEffect, useRef, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { Column, Heading, RevealFx, Text } from "@once-ui-system/core";
import styles from "./QuoteTypewriter.module.scss";

// A characterful serif for the quote, set apart from the site's sans-serif body copy.
const quoteFont = Playfair_Display({
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
// A quote that still wouldn't fit one line at this size is dropped from the
// rotation instead of being shrunk further or allowed to wrap.
const MIN_FONT_SIZE_PX = 12;
const MIN_AUTHOR_FONT_SIZE_PX = 11;
// Leaves a little breathing room so rounding/font-metric differences between
// the measuring clone and the real heading can't tip a quote onto a second line.
const FIT_SAFETY_MARGIN = 0.97;

interface QuoteTypewriterProps {
  quotes: Quote[];
}

// Cycles through the quotes that fit on one line forever, typing each one out
// letter by letter and deleting it before moving to the next. Every quote
// shares one font size — sized so the widest of them still fits a single line
// — so the type looks consistent and the hero's height never changes.
// Respects prefers-reduced-motion by swapping quotes with a plain crossfade
// instead of animating each keystroke.
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
      clone.style.whiteSpace = "nowrap";
      clone.style.fontSize = `${baseFontSize}px`;
      heading.parentElement?.appendChild(clone);

      const measured = quotes.map((quote) => {
        clone.textContent = quote.text;
        return { quote, width: clone.getBoundingClientRect().width };
      });
      clone.remove();

      const fits = measured.filter(
        ({ width }) => width * (MIN_FONT_SIZE_PX / baseFontSize) <= availableWidth,
      );
      const survivors = fits.length > 0 ? fits : measured;

      const widest = Math.max(...survivors.map(({ width }) => width));
      const scale = widest > availableWidth ? (availableWidth / widest) * FIT_SAFETY_MARGIN : 1;
      const fontSize = Math.max(MIN_FONT_SIZE_PX, baseFontSize * scale);
      const authorFontSize = Math.max(MIN_AUTHOR_FONT_SIZE_PX, baseAuthorFontSize * scale);

      const next = survivors.map(({ quote }) => ({ ...quote, fontSize, authorFontSize }));

      setSizedQuotes(next);
      setIndex((current) => (current >= next.length ? 0 : current));
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
  const displayText = reducedMotion.current ? current.text : current.text.slice(0, length);
  const authorVisible = reducedMotion.current || phase === "holding";

  return (
    <>
      <Column ref={headingWrapRef} maxWidth="m" horizontal="center" align="center">
        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
          <Heading
            wrap="balance"
            variant="display-strong-l"
            style={{
              whiteSpace: "nowrap",
              fontSize: current.fontSize ? `${current.fontSize}px` : undefined,
              fontFamily: quoteFont.style.fontFamily,
              fontStyle: "italic",
              fontWeight: 600,
            }}
          >
            {displayText}
            <span className={styles.cursor} aria-hidden="true" />
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
