import { describe, it, expect } from 'vitest';
import {
  isComponentSize,
  resolveSpacing,
  resolveSpacingPixel,
  resolveGap,
  ComponentSpacingPresetMap,
} from './spacing';
import type { ComponentSize } from './types';

describe('theme/spacing', () => {
  describe('isComponentSize', () => {
    it.each([
      ['xxs', true],
      ['xs', true],
      ['sm', true],
      ['md', true],
      ['lg', true],
      ['xl', true],
      ['xxl', true],
      ['unknown', false],
      ['10px', false],
      [16, false],
      [null, false],
      [undefined, false],
    ])('should identify "%s" as component size: %s', (input, expected) => {
      expect(isComponentSize(input)).toBe(expected);
    });
  });

  describe('resolveSpacing', () => {
    it('should return undefined for undefined or null', () => {
      expect(resolveSpacing(undefined)).toBeUndefined();
      expect(resolveSpacing(null as any)).toBeUndefined();
    });

    it('should format numbers into px values', () => {
      expect(resolveSpacing(16)).toBe('16px');
      expect(resolveSpacing(0)).toBe('0px');
    });

    it.each(Object.keys(ComponentSpacingPresetMap) as ComponentSize[])(
      'should resolve tier "%s" to CSS variable with rem fallback',
      (tier) => {
        const expectedRem = ComponentSpacingPresetMap[tier].rem;
        expect(resolveSpacing(tier)).toBe(`var(--spacing-${tier}, ${expectedRem})`);
      },
    );

    it('should pass arbitrary CSS string units as-is', () => {
      expect(resolveSpacing('2.5rem')).toBe('2.5rem');
      expect(resolveSpacing('calc(100% - 20px)')).toBe('calc(100% - 20px)');
    });
  });

  describe('resolveSpacingPixel', () => {
    it('should return undefined for undefined or unparseable string', () => {
      expect(resolveSpacingPixel(undefined)).toBeUndefined();
      expect(resolveSpacingPixel('auto')).toBeUndefined();
    });

    it('should return number as-is', () => {
      expect(resolveSpacingPixel(24)).toBe(24);
    });

    it.each([
      ['xxs' as const, 4],
      ['xs' as const, 8],
      ['sm' as const, 12],
      ['md' as const, 16],
      ['lg' as const, 24],
      ['xl' as const, 32],
      ['xxl' as const, 48],
    ])('should map tier "%s" to %d px', (tier, expectedPx) => {
      expect(resolveSpacingPixel(tier)).toBe(expectedPx);
    });

    it('should parse px and rem strings', () => {
      expect(resolveSpacingPixel('32px')).toBe(32);
      expect(resolveSpacingPixel('1.5rem')).toBe(24);
    });
  });

  describe('resolveGap', () => {
    it('should return undefined for undefined or null', () => {
      expect(resolveGap(undefined)).toBeUndefined();
      expect(resolveGap(null as any)).toBeUndefined();
    });

    it('should resolve single values correctly', () => {
      expect(resolveGap(16)).toBe('16px');
      expect(resolveGap('sm')).toBe('var(--spacing-sm, 0.75rem)');
    });

    it('should resolve tuple [rowGap, colGap]', () => {
      expect(resolveGap([16, 24])).toBe('16px 24px');
      expect(resolveGap(['sm', 'lg'])).toBe('var(--spacing-sm, 0.75rem) var(--spacing-lg, 1.5rem)');
    });
  });
});
