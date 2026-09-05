"use client";

import {
  AvatarGroup,
  Card,
  Column,
  Flex,
  Heading,
  Media,
  SmartLink,
  Tag,
  Text,
} from "@once-ui-system/core";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  tag?: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority,
  images = [],
  title,
  content,
  description,
  tag,
  avatars,
  link,
}) => {
  return (
    <Card radius="l" direction="column" fillWidth border="neutral-alpha-medium" className={styles.card}>
      {images[0] && (
        <SmartLink href={href} unstyled fillWidth>
          <Media
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            aspectRatio="16 / 9"
            alt={title}
            src={images[0]}
            className={styles.media}
          />
        </SmartLink>
      )}
      <Column fillWidth gap="8" padding="20">
        <Flex fillWidth horizontal="between" vertical="start" gap="12">
          {title && (
            <SmartLink href={href} unstyled>
              <Heading as="h3" wrap="balance" variant="heading-strong-m">
                {title}
              </Heading>
            </SmartLink>
          )}
          {tag && (
            <Tag size="s" variant="neutral">
              {tag}
            </Tag>
          )}
        </Flex>
        {description?.trim() && (
          <Text className={styles.summary} variant="body-default-s" onBackground="neutral-weak">
            {description}
          </Text>
        )}
        {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="s" reverse />}
        <Flex gap="20" wrap paddingTop="4">
          {content?.trim() && (
            <SmartLink
              suffixIcon="arrowRight"
              style={{ margin: "0", width: "fit-content" }}
              href={href}
            >
              <Text variant="label-default-s">Case study</Text>
            </SmartLink>
          )}
          {link && (
            <SmartLink
              suffixIcon="arrowUpRightFromSquare"
              style={{ margin: "0", width: "fit-content" }}
              href={link}
            >
              <Text variant="label-default-s">GitHub</Text>
            </SmartLink>
          )}
        </Flex>
      </Column>
    </Card>
  );
};
