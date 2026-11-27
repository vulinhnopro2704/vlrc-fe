import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Box, Paragraph, Title, VStack } from '@vlrc-fe/components';
import { colors, radius, shadow, spacing } from '@vlrc-fe/components/theme/tokens.stylex';
import { SlideIn } from './SlideIn';

const styles = stylex.create({
  banner: {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 640px)': 'minmax(0,1.5fr) minmax(0,1fr)',
    },
    backgroundColor: colors.card,
    borderRadius: radius['3xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: shadow.sm,
  },
  copy: {
    padding: { default: spacing[5], '@media (min-width: 768px)': spacing[8] },
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 'clamp(1.65rem,4vw,3rem)',
    lineHeight: 1.08,
    letterSpacing: '-.04em',
    color: colors.foreground,
    textWrap: 'balance',
  },
  artwork: {
    position: 'absolute',
    inset: 0,
    objectFit: 'cover',
    objectPosition: 'center 68%',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  scene: {
    minHeight: { default: 116, '@media (min-width: 640px)': 178 },
    height: '100%',
    display: 'grid',
    alignItems: 'end',
    justifyItems: 'center',
    position: 'relative',
    isolation: 'isolate',
    order: { default: -1, '@media (min-width: 640px)': 0 },
  },
});

export function TrailBanner({
  title,
  detail,
  children,
  artwork,
  companion,
}: {
  title: string;
  detail?: string;
  children?: ReactNode;
  artwork: string;
  companion?: ReactNode;
}) {
  return (
    <SlideIn from="bottom">
      <Box sx={styles.banner}>
        <VStack gap="sm" sx={styles.copy}>
          <Title level={1} sx={styles.title}>
            {title}
          </Title>
          {detail && <Paragraph type="muted">{detail}</Paragraph>}
          {children}
        </VStack>
        <Box sx={styles.scene}>
          <Box as="img" src={artwork} alt="" sx={styles.artwork} />
          {companion}
        </Box>
      </Box>
    </SlideIn>
  );
}
