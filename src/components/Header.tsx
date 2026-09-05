"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Fade, Flex, Line, Row, ToggleButton } from "@once-ui-system/core";

import { display, person, about, work } from "@/resources";
import type { IconName } from "@/resources/icons";
import { scrollToSection } from "./scrollToSection";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

// The site is one page, so nav items are anchors into it rather than routes.
// Order here must match the order the sections appear in app/page.tsx.
const sections: Array<{ id: string; label: string; icon: IconName }> = [
  { id: "about", label: about.label, icon: "person" },
  ...(about.studies.display
    ? [{ id: "education", label: about.studies.title, icon: "book" as IconName }]
    : []),
  { id: "projects", label: work.label, icon: "grid" },
  ...(about.publications.display
    ? [{ id: "publications", label: about.publications.title, icon: "document" as IconName }]
    : []),
];

/**
 * The id of the last section whose top has scrolled under the header, or null
 * while the hero is still in frame. Only runs on the single page itself.
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    // Called straight from the scroll event rather than throttled through
    // requestAnimationFrame: three rect reads are cheap, and rAF is paused in
    // backgrounded tabs, which would freeze the highlight.
    const update = () => {
      // A line just below the sticky header; the last section above it wins.
      const line = 140;
      let current: string | null = null;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= line) {
          current = section.id;
        }
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  return active;
}

export const Header = () => {
  const pathname = usePathname() ?? "";
  // trailingSlash is on, so "/" arrives as "/" but be lenient anyway.
  const onSinglePage = pathname === "/" || pathname === "";
  const activeSection = useActiveSection(onSinglePage);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          {display.location && <Row s={{ hide: true }}>{person.location}</Row>}
        </Row>
        <Row fillWidth horizontal="center">
          <Row
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Row gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              {onSinglePage ? (
                <ToggleButton
                  prefixIcon="home"
                  onClick={scrollToTop}
                  selected={activeSection === null}
                />
              ) : (
                <ToggleButton prefixIcon="home" href="/" selected={false} />
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              {sections.map((section) => {
                const selected = onSinglePage && activeSection === section.id;
                // On the page itself this is a scroll, not a navigation. From a
                // project page it's a real link home, and ScrollToHash takes
                // over once the page loads.
                const navProps = onSinglePage
                  ? { onClick: () => scrollToSection(section.id) }
                  : { href: `/#${section.id}` };

                return (
                  <Row key={section.id}>
                    <Row s={{ hide: true }}>
                      <ToggleButton
                        prefixIcon={section.icon}
                        label={section.label}
                        selected={selected}
                        {...navProps}
                      />
                    </Row>
                    <Row hide s={{ hide: false }}>
                      <ToggleButton
                        prefixIcon={section.icon}
                        selected={selected}
                        {...navProps}
                      />
                    </Row>
                  </Row>
                );
              })}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="24" />
                  <ThemeToggle />
                </>
              )}
            </Row>
          </Row>
        </Row>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex s={{ hide: true }}>
              {display.time && <TimeDisplay timeZone={person.location} />}
            </Flex>
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
