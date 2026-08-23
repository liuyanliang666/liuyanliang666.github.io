import { Button, Column, Heading, Row, Tag, Text } from "@once-ui-system/core";
import { about } from "@/resources";

export function PublicationsSection() {
  const { publications } = about;

  return (
    <Column id="publications" fillWidth gap="l">
      <Heading as="h2" variant="display-strong-s">
        {publications.title}
      </Heading>
      <Column fillWidth gap="xl" paddingX="l">
        {publications.items.map((publication, index) => (
          <Column key={`${publication.title}-${index}`} fillWidth gap="4">
            <Row fillWidth horizontal="between" vertical="end" gap="16" marginBottom="4">
              <Text variant="heading-strong-l">{publication.title}</Text>
              <Text
                variant="heading-default-xs"
                onBackground="neutral-weak"
                style={{ whiteSpace: "nowrap" }}
              >
                {publication.year}
              </Text>
            </Row>
            <Row gap="8" vertical="center" wrap>
              {publication.venue && (
                <Text variant="body-default-s" onBackground="brand-weak">
                  {publication.venue}
                </Text>
              )}
              {publication.status && <Tag size="s">{publication.status}</Tag>}
            </Row>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {publication.authors}
            </Text>
            {publication.description && (
              <Text variant="body-default-m">{publication.description}</Text>
            )}
            {publication.links && publication.links.length > 0 && (
              <Row wrap gap="8" paddingTop="8" data-border="rounded">
                {publication.links.map((link, linkIndex) => (
                  <Button
                    key={`${publication.title}-${linkIndex}`}
                    href={link.href}
                    prefixIcon={link.icon}
                    label={link.label}
                    size="s"
                    weight="default"
                    variant="secondary"
                  />
                ))}
              </Row>
            )}
          </Column>
        ))}
      </Column>
    </Column>
  );
}
