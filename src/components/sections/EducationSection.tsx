import { Avatar, Column, Heading, Row, Text } from "@once-ui-system/core";
import { about } from "@/resources";

export function EducationSection() {
  const { studies } = about;

  return (
    <Column id="education" fillWidth gap="l">
      <Heading as="h2" variant="display-strong-s">
        {studies.title}
      </Heading>
      <Column fillWidth gap="l" paddingX="l">
        {studies.institutions.map((institution, index) => (
          <Row key={`${institution.name}-${index}`} fillWidth gap="16" vertical="center">
            {institution.logo && <Avatar src={institution.logo} size="l" />}
            <Column fillWidth gap="4">
              <Row fillWidth horizontal="between" vertical="end">
                <Text variant="heading-strong-l">{institution.name}</Text>
                <Text variant="heading-default-xs" onBackground="neutral-weak">
                  {institution.timeframe}
                </Text>
              </Row>
              <Text variant="heading-default-xs" onBackground="neutral-weak">
                {institution.description}
              </Text>
            </Column>
          </Row>
        ))}
      </Column>
    </Column>
  );
}
