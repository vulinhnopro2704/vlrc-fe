import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';

const mockScrollPrev = vi.fn();
const mockScrollNext = vi.fn();

const mockEmblaApi = {
  scrollPrev: mockScrollPrev,
  scrollNext: mockScrollNext,
  canScrollPrev: () => true,
  canScrollNext: () => true,
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), mockEmblaApi],
}));

const SLIDE_1_TEXT = 'Slide 1';
const SLIDE_2_TEXT = 'Slide 2';
const INPUT_PLACEHOLDER = 'Type message...';

describe('Carousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UI', () => {
    it('should match snapshot in default horizontal orientation', () => {
      const { asFragment } = render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>{SLIDE_1_TEXT}</CarouselItem>
            <CarouselItem>{SLIDE_2_TEXT}</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in vertical orientation', () => {
      const { asFragment } = render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>{SLIDE_1_TEXT}</CarouselItem>
            <CarouselItem>{SLIDE_2_TEXT}</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should trigger scrollNext when ArrowRight is pressed on carousel region', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>{SLIDE_1_TEXT}</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );

      const region = screen.getByRole('region');
      fireEvent.keyDown(region, { key: 'ArrowRight' });

      expect(mockScrollNext).toHaveBeenCalledTimes(1);
    });

    it('should trigger scrollPrev when ArrowLeft is pressed on carousel region', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>{SLIDE_1_TEXT}</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );

      const region = screen.getByRole('region');
      fireEvent.keyDown(region, { key: 'ArrowLeft' });

      expect(mockScrollPrev).toHaveBeenCalledTimes(1);
    });

    it('should trigger scrollNext and scrollPrev when ArrowDown and ArrowUp are pressed in vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>{SLIDE_1_TEXT}</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );

      const region = screen.getByRole('region');
      fireEvent.keyDown(region, { key: 'ArrowDown' });
      expect(mockScrollNext).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(region, { key: 'ArrowUp' });
      expect(mockScrollPrev).toHaveBeenCalledTimes(1);
    });

    it('should not scroll carousel when arrow keys are pressed inside a child input', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <input placeholder={INPUT_PLACEHOLDER} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>,
      );

      const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER);
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'ArrowLeft' });

      expect(mockScrollNext).not.toHaveBeenCalled();
      expect(mockScrollPrev).not.toHaveBeenCalled();
    });
  });
});
