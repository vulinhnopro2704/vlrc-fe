/**
 * Semantic width presets map associating named presets with CSS width values.
 */
export const ComponentWidthPresetMap = {
  // Keyword & layout widths
  full: '100%',
  auto: 'auto',
  fit: 'fit-content',
  max: 'max-content',
  min: 'min-content',
  screen: '100vw',

  // 7-tier standard scale presets
  xxs: '6rem', // 96px
  xs: '8rem', // 128px
  sm: '12rem', // 192px
  md: '16rem', // 256px
  lg: '20rem', // 320px
  xl: '24rem', // 384px
  xxl: '32rem', // 512px

  // Fractional presets
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
} as const;

export type ComponentWidthPreset = keyof typeof ComponentWidthPresetMap;

/**
 * Universal component width type supporting semantic presets, custom numbers (in px),
 * and arbitrary CSS strings with autocomplete preserved.
 */
export type ComponentWidth = ComponentWidthPreset | number | (string & {});

/** Alias for ComponentWidth */
export type Width = ComponentWidth;

/**
 * Resolves a ComponentWidth prop into a valid CSS width string.
 * - number: converts to `${width}px` (e.g. 240 -> '240px')
 * - preset: converts from ComponentWidthPresetMap (e.g. 'full' -> '100%', 'md' -> '16rem')
 * - custom string: returned as-is (e.g. '18rem', 'calc(100% - 2rem)')
 */
export function resolveWidth(width?: ComponentWidth): string | undefined {
  if (width === undefined || width === null) {
    return undefined;
  }
  if (typeof width === 'number') {
    return `${width}px`;
  }
  if (typeof width === 'string' && width in ComponentWidthPresetMap) {
    return ComponentWidthPresetMap[width as ComponentWidthPreset];
  }
  return width;
}
