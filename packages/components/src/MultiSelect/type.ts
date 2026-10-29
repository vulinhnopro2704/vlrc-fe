import type { ReactNode } from 'react';

/**
 * Animation types and configurations
 */
export interface AnimationConfig {
  /** Badge animation type */
  badgeAnimation?: 'bounce' | 'pulse' | 'wiggle' | 'fade' | 'slide' | 'none';
  /** Popover animation type */
  popoverAnimation?: 'scale' | 'slide' | 'fade' | 'flip' | 'none';
  /** Option hover animation type */
  optionHoverAnimation?: 'highlight' | 'scale' | 'glow' | 'none';
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
}

export type MultiSelectVariant = 'default' | 'secondary' | 'destructive' | 'inverted';

/**
 * Transitional variants helper for the multi-select component.
 */
export const multiSelectVariants = (options?: {
  variant?: MultiSelectVariant;
  badgeAnimation?: 'bounce' | 'pulse' | 'wiggle' | 'fade' | 'slide' | 'none';
  className?: string;
}) => {
  return options?.className || '';
};

/**
 * Option interface for MultiSelect component
 */
export interface MultiSelectOption {
  /** The text to display for the option. */
  label: string;
  /** The unique value associated with the option. */
  value: string;
  /** Optional icon component to display alongside the option. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Custom color styling for the option */
  style?: {
    /** Badge background color */
    badgeColor?: string;
    /** Gradient for badge */
    gradient?: string;
    /** Icon color */
    iconColor?: string;
  };
}

/**
 * Option group interface for grouped options in MultiSelect component
 */
export interface MultiSelectGroup {
  /** The heading/label for the group */
  heading: string;
  /** Options in this group */
  options: MultiSelectOption[];
}

/**
 * Props for MultiSelect component
 */
export interface MultiSelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'animationConfig'> {
  variant?: MultiSelectVariant;
  badgeAnimation?: 'bounce' | 'pulse' | 'wiggle' | 'fade' | 'slide' | 'none';
  /**
   * An array of option objects or groups to be displayed in the multi-select component.
   */
  options: MultiSelectOption[] | MultiSelectGroup[];
  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * The currently selected values. If provided, the component becomes controlled.
   */
  value?: string[];

  /**
   * The placeholder text to display when no values are selected.
   * Characters beyond the limit will be truncated with an ellipsis.
   * Can be configured via responsive.placeholderLength
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Set to 0 to disable animations.
   * @deprecated Use animationConfig instead for more control
   */
  animation?: number;

  /**
   * Advanced animation configuration
   */
  animationConfig?: AnimationConfig;

  /**
   * Maximum number of items to display. Extra items will be summarized.
   * Can be responsive based on screen size or auto-calculated based on container width.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * Hide the "Select All" option from the dropdown menu.
   * Useful when selecting all items doesn't make sense or isn't desirable.
   * Optional, defaults to false.
   */
  hideSelectAll?: boolean;

  /**
   * Enable or disable the search input in the dropdown menu.
   * Optional, defaults to true.
   */
  searchable?: boolean;

  /**
   * Custom component or function to render when no options match the search criteria.
   * Optional, defaults to "No results found."
   */
  emptyIndicator?: ReactNode;

  /**
   * Automatically calculate maxCount based on container width.
   * When enabled, the component will dynamically adjust the number of visible badges
   * to prevent wrapping and maintain a clean appearance.
   * Optional, defaults to false.
   */
  autoSize?: boolean;

  /**
   * Enforce a single line display for the selected items container.
   * When enabled, items will not wrap to multiple lines, and excess items
   * will be hidden behind a counter badge.
   * Optional, defaults to false.
   */
  singleLine?: boolean;

  /**
   * Additional class names to apply to the popover content.
   * Useful for customizing the appearance of the dropdown list.
   * Optional.
   */
  popoverClassName?: string;

  /**
   * Disable the entire multi-select component.
   * When true, the component cannot be interacted with and displays in a disabled state.
   * Optional, defaults to false.
   */
  disabled?: boolean;

  /**
   * Responsive configuration for different screen sizes.
   * Allows customizing behavior for mobile, tablet, and desktop views.
   */
  responsive?: boolean | {
    /** Settings for mobile screens (< 640px) */
    mobile?: {
      maxCount?: number;
      placeholderLength?: number;
      hideIcons?: boolean;
      compactMode?: boolean;
    };
    /** Settings for tablet screens (640px - 1024px) */
    tablet?: {
      maxCount?: number;
      placeholderLength?: number;
      hideIcons?: boolean;
      compactMode?: boolean;
    };
    /** Settings for desktop screens (> 1024px) */
    desktop?: {
      maxCount?: number;
      placeholderLength?: number;
      hideIcons?: boolean;
      compactMode?: boolean;
    };
  };

  /**
   * Minimum width for the component.
   * Can be any valid CSS width value (e.g., '200px', '15rem', '100%').
   */
  minWidth?: string;

  /**
   * Maximum width for the component.
   * Can be any valid CSS width value (e.g., '400px', '30rem', '100%').
   */
  maxWidth?: string;

  /**
   * Automatically remove duplicate options based on their value.
   * When true, only the first occurrence of each unique value will be kept.
   * Optional, defaults to false.
   */
  deduplicateOptions?: boolean;

  /**
   * Reset internal state when defaultValue prop changes.
   * When true, the component will update its selected values if defaultValue changes.
   * Useful for forms that reset or update from external state.
   * Optional, defaults to true.
   */
  resetOnDefaultValueChange?: boolean;

  /**
   * Close the popover immediately after an option is selected.
   * When true, selecting any option will close the dropdown.
   * Optional, defaults to false.
   */
  closeOnSelect?: boolean;
}

/**
 * Imperative ref methods exposed by the MultiSelect component
 */
export interface MultiSelectRef {
  /** Reset the selection to empty or defaultValue */
  reset: () => void;
  /** Get the currently selected values */
  getSelectedValues: () => string[];
  /** Programmatically set the selected values */
  setSelectedValues: (values: string[]) => void;
  /** Clear all selections */
  clear: () => void;
  /** Focus the multi-select trigger button */
  focus: () => void;
  /** Select all available options */
  selectAll?: () => void;
  /** Deselect all currently selected options */
  clearAll?: () => void;
}
