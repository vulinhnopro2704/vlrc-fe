import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { FoxMascot } from './FoxMascot';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it('returns to the celebration face after repeated pets with reduced motion', () => {
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  const onPet = vi.fn();
  render(<FoxMascot label="Pet Fox" happy onPet={onPet} />);
  const button = screen.getByRole('button', { name: 'Pet Fox' });
  const sprite = button.querySelector('img')!;
  const happy = sprite.src;
  fireEvent.click(button);
  expect(sprite.src).not.toBe(happy);
  act(() => vi.advanceTimersByTime(500));
  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(500));
  expect(sprite.src).not.toBe(happy);
  act(() => vi.advanceTimersByTime(150));
  expect(sprite.src).toBe(happy);
  expect(onPet).toHaveBeenCalledTimes(2);
});
