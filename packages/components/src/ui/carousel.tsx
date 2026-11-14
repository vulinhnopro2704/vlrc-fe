'use client';

import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';

import { radius } from '../theme/tokens.stylex';
import { cn } from '../utils';
import { Button } from './button';

const styles = stylex.create({
  carousel: {
    position: 'relative',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
  },
  contentHorizontal: {
    marginLeft: '-1rem',
  },
  contentVertical: {
    marginTop: '-1rem',
    flexDirection: 'column',
  },
  item: {
    minWidth: 0,
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: '100%',
  },
  itemHorizontal: {
    paddingLeft: '1rem',
  },
  itemVertical: {
    paddingTop: '1rem',
  },
  button: {
    position: 'absolute',
    width: '2rem',
    height: '2rem',
    borderRadius: radius.full,
    padding: 0,
  },
  prevHorizontal: {
    top: '50%',
    left: '-3rem',
    transform: 'translateY(-50%)',
  },
  prevVertical: {
    top: '-3rem',
    left: '50%',
    transform: 'translateX(-50%) rotate(90deg)',
  },
  nextHorizontal: {
    top: '50%',
    right: '-3rem',
    transform: 'translateY(-50%)',
  },
  nextVertical: {
    bottom: '-3rem',
    left: '50%',
    transform: 'translateX(-50%) rotate(90deg)',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  sx?: stylex.StyleXStyles;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  sx,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
      }
    },
    [scrollPrev],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  const styleProps = stylex.props(styles.carousel, sx);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        {...styleProps}
        className={cn(styleProps.className, className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export interface CarouselContentProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function CarouselContent({ className, sx, ...props }: CarouselContentProps) {
  const { carouselRef, orientation } = useCarousel();
  const orientationStyle =
    orientation === 'horizontal' ? styles.contentHorizontal : styles.contentVertical;
  const styleProps = stylex.props(styles.content, orientationStyle, sx);

  return (
    <div ref={carouselRef} {...stylex.props(styles.overflowHidden)} data-slot="carousel-content">
      <div {...styleProps} className={cn(styleProps.className, className)} {...props} />
    </div>
  );
}

export interface CarouselItemProps extends React.ComponentProps<'div'> {
  sx?: stylex.StyleXStyles;
}

function CarouselItem({ className, sx, ...props }: CarouselItemProps) {
  const { orientation } = useCarousel();
  const orientationStyle =
    orientation === 'horizontal' ? styles.itemHorizontal : styles.itemVertical;
  const styleProps = stylex.props(styles.item, orientationStyle, sx);

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}

export interface CarouselPreviousProps extends React.ComponentProps<typeof Button> {
  sx?: stylex.StyleXStyles;
}

function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'icon',
  sx,
  ...props
}: CarouselPreviousProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const posStyle = orientation === 'horizontal' ? styles.prevHorizontal : styles.prevVertical;

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      sx={[styles.button, posStyle, sx]}
      className={className}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span {...stylex.props(styles.srOnly)}>Previous slide</span>
    </Button>
  );
}

export interface CarouselNextProps extends React.ComponentProps<typeof Button> {
  sx?: stylex.StyleXStyles;
}

function CarouselNext({
  className,
  variant = 'outline',
  size = 'icon',
  sx,
  ...props
}: CarouselNextProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const posStyle = orientation === 'horizontal' ? styles.nextHorizontal : styles.nextVertical;

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      sx={[styles.button, posStyle, sx]}
      className={className}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span {...stylex.props(styles.srOnly)}>Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
