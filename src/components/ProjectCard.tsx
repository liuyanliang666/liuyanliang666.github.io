"use client";

import { AvatarGroup, Card, Column, Flex, Heading, Icon, Media, Tag, Text } from "@once-ui-system/core";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  priority?: boolean;
  images: string[];
  title: string;
  description: string;
  tag?: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  priority,
  images = [],
  title,
  description,
  tag,
  avatars,
  link,
}) => {
  return (
    <Card
      radius="l"
      direction="column"
      fillWidth
      border="neutral-alpha-medium"
      className={styles.card}
      href={link || undefined}
    >
      {images[0] && (
        <Media
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          aspectRatio="16 / 9"
          alt={title}
          src={images[0]}
          className={styles.media}
        />
      )}
      <Column fillWidth gap="8" padding="20">
        <Flex fillWidth horizontal="between" vertical="start" gap="12">
          {title && (
            <Flex gap="8" vertical="center">
              <Heading as="h3" wrap="balance" variant="heading-strong-m">
                {title}
              </Heading>
              {link && <Icon name="arrowUpRightFromSquare" size="xs" onBackground="neutral-weak" />}
            </Flex>
          )}
          {tag && (
            <Tag size="s" variant="neutral">
              {tag}
            </Tag>
          )}
        </Flex>
        {description?.trim() && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            {description}
          </Text>
        )}
        {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="s" reverse />}
      </Column>
    </Card>
  );
};
