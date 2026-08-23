import {
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Heading,
  Text,
  Line,
} from "@once-ui-system/core";
import { home, about, person, baseURL } from "@/resources";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PublicationsSection } from "@/components/sections/PublicationsSection";
import { ScrollToHash } from "@/components/ScrollToHash";
import { ScrollButton } from "@/components/ScrollButton";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={"/images/og/home.jpg"}
        author={{
          name: person.name,
          url: baseURL,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {/* Lets /#projects-style links from the project pages land on the right section. */}
      <ScrollToHash />

      {/* Hero — reveals on load, one element after the next. */}
      <Column fillWidth horizontal="center" gap="m" paddingBottom="xl">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <ScrollButton sectionId="about">
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.label}
              </Row>
            </ScrollButton>
          </RevealFx>
        </Column>
      </Column>

      {/* Sections below the fold reveal as they scroll into view. */}
      <RevealOnScroll>
        <AboutSection />
      </RevealOnScroll>

      <Row fillWidth horizontal="center" paddingY="l">
        <Line maxWidth={48} background="neutral-alpha-medium" />
      </Row>

      <RevealOnScroll>
        <ProjectsSection />
      </RevealOnScroll>

      {about.publications.display && (
        <>
          <Row fillWidth horizontal="center" paddingY="l">
            <Line maxWidth={48} background="neutral-alpha-medium" />
          </Row>
          <RevealOnScroll>
            <PublicationsSection />
          </RevealOnScroll>
        </>
      )}
    </Column>
  );
}
