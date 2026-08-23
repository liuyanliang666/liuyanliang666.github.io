import { Column, Heading } from "@once-ui-system/core";
import { work } from "@/resources";
import { Projects } from "@/components/work/Projects";

export function ProjectsSection() {
  return (
    <Column id="projects" fillWidth gap="l">
      <Heading as="h2" variant="display-strong-s">
        {work.label}
      </Heading>
      <Projects />
    </Column>
  );
}
