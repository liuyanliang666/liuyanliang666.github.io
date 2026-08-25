"use client";

import { useEffect, useRef, useState } from "react";
import { Column, Heading, RevealFx, Text } from "@once-ui-system/core";
import styles from "./QuoteTypewriter.module.scss";

type Quote = { text: string; author: string };
type Phase = "typing" | "holding" | "deleting";

const TYPE_MS = 34;
const DELETE_MS = 16;
const HOLD_MS = 2600;
const PAUSE_MS = 500;
const REDUCED_MOTION_HOLD_MS = 4200;

interface QuoteTypewriterProps {
  quotes: Quote[];
}

// Cycles through `quotes` forever, typing each one out letter by letter and
// deleting it before moving to the next. Respects prefers-reduced-motion by
// swapping quotes with a plain crossfade instead of animating each keystroke.
export function QuoteTypewriter({ quotes }: QuoteTypewriterProps) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reducedMotion.current) {
      const id = window.setInterval(() => {
        setIndex((current) => (current + 1) % quotes.length);
      }, REDUCED_MOTION_HOLD_MS);
      return () => window.clearInterval(id);
    }

    const full = quotes[index].text;
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
              setIndex((current) => (current + 1) % quotes.length);
              setPhase("typing");
            }, PAUSE_MS);
    }

    return () => window.clearTimeout(timeout);
  }, [phase, length, index, quotes]);

  const current = quotes[index];
  const displayText = reducedMotion.current ? current.text : current.text.slice(0, length);
  const authorVisible = reducedMotion.current || phase === "holding";

  return (
    <>
      <Column maxWidth="m" horizontal="center" align="center">
        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
          <Heading wrap="balance" variant="display-strong-l">
            {displayText}
            <span className={styles.cursor} aria-hidden="true" />
          </Heading>
        </RevealFx>
      </Column>
      <Column maxWidth="l" horizontal="center" align="center">
        <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
          <Text
            wrap="balance"
            onBackground="neutral-weak"
            variant="heading-default-xl"
            className={styles.author}
            style={{ opacity: authorVisible ? 1 : 0 }}
          >
            — {current.author}
          </Text>
        </RevealFx>
      </Column>
    </>
  );
}
