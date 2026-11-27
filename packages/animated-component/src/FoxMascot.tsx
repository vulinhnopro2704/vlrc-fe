import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as stylex from '@stylexjs/stylex';
import { Box, Button } from '@vlrc-fe/components';

const faces = {
  friend: new URL('./fox/friend.webp', import.meta.url).href,
  left: new URL('./fox/left.webp', import.meta.url).href,
  right: new URL('./fox/right.webp', import.meta.url).href,
  happy: new URL('./fox/happy.webp', import.meta.url).href,
  wink: new URL('./fox/wink.webp', import.meta.url).href,
};

const styles = stylex.create({
  button: { width: '100%', height: '100%', padding: 0, backgroundColor: 'transparent' },
  frame: { width: '100%', height: '100%', objectFit: 'contain', transformOrigin: '50% 85%' },
  small: { width: 48, height: 48, flexShrink: 0 },
  large: { width: 110, height: 110, flexShrink: 0 },
});

export function FoxMascot({
  label,
  size = 'large',
  happy = false,
  onPet,
}: {
  label: string;
  size?: 'small' | 'large';
  happy?: boolean;
  onPet?: () => void;
}) {
  const sprite = useRef<HTMLImageElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [direction, setDirection] = useState<'left' | 'friend' | 'right'>('friend');
  const [wink, setWink] = useState(false);
  useEffect(() => {
    const el = sprite.current;
    return () => {
      clearTimeout(timer.current);
      if (el) gsap.killTweensOf(el);
    };
  }, []);
  function pet() {
    onPet?.();
    setWink(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWink(false), 650);
    if (sprite.current && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(
        sprite.current,
        { scaleY: 0.82, rotation: -5 },
        { scaleY: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1,.4)', overwrite: true },
      );
    }
  }
  return (
    <Box sx={styles[size]}>
      <Button
        type="button"
        variant="ghost"
        sx={styles.button}
        aria-label={label}
        onClick={pet}
        onPointerLeave={() => setDirection('friend')}
        onPointerMove={(event) => {
          if (
            event.pointerType !== 'mouse' ||
            matchMedia('(prefers-reduced-motion: reduce)').matches
          )
            return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const offset = (event.clientX - bounds.left) / bounds.width;
          setDirection(offset < 0.4 ? 'left' : offset > 0.6 ? 'right' : 'friend');
        }}
      >
        <img
          ref={sprite}
          {...stylex.props(styles.frame)}
          src={faces[wink ? 'wink' : happy ? 'happy' : direction]}
          alt=""
        />
      </Button>
    </Box>
  );
}
