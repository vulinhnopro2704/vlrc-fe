import { useLayoutEffect, useRef, type ReactNode } from 'react';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Box } from '@vlrc-fe/components';
import { gsap } from 'gsap';

export function SlideIn({
  children,
  from = 'right',
  sx,
}: {
  children: ReactNode;
  from?: 'left' | 'right' | 'bottom';
  sx?: StyleXStyles;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(element, {
        x: from === 'bottom' ? 0 : from === 'left' ? -16 : 16,
        y: from === 'bottom' ? 12 : 0,
        opacity: 0,
        ease: 'power2.out',
        duration: 0.22,
        clearProps: 'transform,opacity',
      });
    });
    return () => media.revert();
  }, [from]);

  return (
    <Box ref={ref} sx={sx}>
      {children}
    </Box>
  );
}
