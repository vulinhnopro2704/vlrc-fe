import {
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type ReactNode,
  type SetStateAction,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react';

import { colors, radii } from '../theme/tokens.stylex';
import { cn } from '../utils';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Text } from '../Typography';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';
import {
  type AnimationConfig,
  type MultiSelectGroup,
  type MultiSelectOption,
  type MultiSelectProps,
} from './type';
import { isGroupedOptions, type ResponsiveSettings, type ScreenSize } from './utils';

const styles = stylex.create({
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
  selectedValuesRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  badgeList: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  badgeListWrap: {
    flexWrap: 'wrap',
  },
  badgeListSingleLine: {
    overflowX: 'auto',
    paddingBottom: '0.25rem',
  },
  badgeListCompact: {
    gap: '0.125rem',
  },
  badgeIcon: {
    height: '1rem',
    width: '1rem',
    marginRight: '0.5rem',
  },
  badgeIconCompact: {
    height: '0.75rem',
    width: '0.75rem',
    marginRight: '0.25rem',
  },
  badgeRemoveButton: {
    marginLeft: '0.5rem',
    height: '1rem',
    width: '1rem',
    cursor: 'pointer',
    borderRadius: radii.sm,
    padding: '0.125rem',
    borderWidth: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  badgeRemoveIcon: {
    height: '0.75rem',
    width: '0.75rem',
  },
  badgeRemoveIconCompact: {
    height: '0.625rem',
    width: '0.625rem',
  },
  badgeLabel: {
    maxWidth: '10rem',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '0.75rem',
  },
  optionLabelText: {
    flex: '1 1 0%',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  extraBadge: {
    backgroundColor: 'transparent',
    color: colors.foreground,
    borderColor: colors.border,
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
  extraBadgeRemoveIcon: {
    marginLeft: '0.5rem',
    height: '1rem',
    width: '1rem',
    cursor: 'pointer',
  },
  extraBadgeRemoveIconCompact: {
    marginLeft: '0.25rem',
    height: '0.75rem',
    width: '0.75rem',
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearAllButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '1rem',
    width: '1rem',
    marginInline: '0.5rem',
    cursor: 'pointer',
    color: colors.mutedForeground,
    borderRadius: radii.sm,
    outline: 'none',
    ':hover': {
      color: colors.foreground,
    },
  },
  clearIcon: {
    height: '1rem',
    width: '1rem',
  },
  separator: {
    display: 'flex',
    minHeight: '1.5rem',
    height: '100%',
  },
  chevronIcon: {
    height: '1rem',
    width: '1rem',
    marginInline: '0.5rem',
    cursor: 'pointer',
    color: colors.mutedForeground,
  },
  placeholderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginInline: 'auto',
  },
  placeholderText: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginInline: '0.75rem',
  },
  placeholderChevron: {
    height: '1rem',
    width: '1rem',
    cursor: 'pointer',
    color: colors.mutedForeground,
    marginInline: '0.5rem',
  },
  checkboxContainer: {
    marginRight: '0.5rem',
    display: 'flex',
    height: '1rem',
    width: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.primary,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  checkboxUnchecked: {
    opacity: 0.5,
  },
  checkIcon: {
    height: '1rem',
    width: '1rem',
  },
  optionIcon: {
    marginRight: '0.5rem',
    height: '1rem',
    width: '1rem',
    color: colors.mutedForeground,
  },
  footerActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerActionItem: {
    flex: 1,
    justifyContent: 'center',
    cursor: 'pointer',
  },
});

export const LiveRegion = ({
  politeMessage,
  assertiveMessage,
}: {
  politeMessage: string;
  assertiveMessage: string;
}) => (
  <div {...stylex.props(styles.srOnly)}>
    <div aria-live="polite" aria-atomic="true" role="status">
      {politeMessage}
    </div>
    <div aria-live="assertive" aria-atomic="true" role="alert">
      {assertiveMessage}
    </div>
  </div>
);

interface SelectedValuesContentProps {
  selectedValues: string[];
  responsiveSettings: ResponsiveSettings;
  screenSize: ScreenSize;
  singleLine: boolean;
  animation: number;
  animationConfig?: AnimationConfig;
  badgeAnimationClass: string;
  variant: MultiSelectProps['variant'];
  getOptionByValue: (value: string) => MultiSelectOption | undefined;
  toggleOption: (value: string) => void;
  clearExtraOptions: () => void;
  handleClear: () => void;
}

export const SelectedValuesContent = ({
  selectedValues,
  responsiveSettings,
  screenSize: _screenSize,
  singleLine,
  animation,
  animationConfig,
  badgeAnimationClass,
  variant,
  getOptionByValue,
  toggleOption,
  clearExtraOptions,
  handleClear,
}: SelectedValuesContentProps) => (
  <div {...stylex.props(styles.selectedValuesRoot)}>
    <div
      {...stylex.props(
        styles.badgeList,
        singleLine ? styles.badgeListSingleLine : styles.badgeListWrap,
        responsiveSettings.compactMode ? styles.badgeListCompact : undefined,
      )}
    >
      {selectedValues
        .slice(0, responsiveSettings.maxCount)
        .map((value) => {
          const option = getOptionByValue(value);
          const IconComponent = option?.icon;
          const customStyle = option?.style;
          if (!option) return null;

          const badgeStyle: CSSProperties = {
            animationDuration: `${animation}s`,
            ...(customStyle?.badgeColor && {
              backgroundColor: customStyle.badgeColor,
            }),
            ...(customStyle?.gradient && {
              background: customStyle.gradient,
              color: 'white',
            }),
          };

          const badgeVariant = variant === 'inverted' ? 'secondary' : variant || 'secondary';

          return (
            <Badge
              key={value}
              variant={badgeVariant}
              className={cn(badgeAnimationClass)}
              style={{
                ...badgeStyle,
                animationDuration: `${animationConfig?.duration || animation}s`,
                animationDelay: `${animationConfig?.delay || 0}s`,
              }}
            >
              {IconComponent && !responsiveSettings.hideIcons && (
                <IconComponent
                  {...stylex.props(
                    responsiveSettings.compactMode ? styles.badgeIconCompact : styles.badgeIcon,
                  )}
                  {...(customStyle?.iconColor && {
                    style: { color: customStyle.iconColor },
                  })}
                />
              )}
              <Text ellipsis tooltip sx={styles.badgeLabel}>
                {option.label}
              </Text>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleOption(value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleOption(value);
                  }
                }}
                aria-label={`Remove ${option.label} from selection`}
                {...stylex.props(styles.badgeRemoveButton)}
              >
                <XCircle
                  {...stylex.props(
                    responsiveSettings.compactMode
                      ? styles.badgeRemoveIconCompact
                      : styles.badgeRemoveIcon,
                  )}
                />
              </button>
            </Badge>
          );
        })
        .filter(Boolean)}
      {selectedValues.length > responsiveSettings.maxCount && (
        <Badge
          sx={styles.extraBadge}
          className={cn(badgeAnimationClass)}
          style={{
            animationDuration: `${animationConfig?.duration || animation}s`,
            animationDelay: `${animationConfig?.delay || 0}s`,
          }}
        >
          {`+ ${selectedValues.length - responsiveSettings.maxCount} more`}
          <XCircle
            {...stylex.props(
              responsiveSettings.compactMode
                ? styles.extraBadgeRemoveIconCompact
                : styles.extraBadgeRemoveIcon,
            )}
            onClick={(event) => {
              event.stopPropagation();
              clearExtraOptions();
            }}
          />
        </Badge>
      )}
    </div>
    <div {...stylex.props(styles.actionsContainer)}>
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          handleClear();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            handleClear();
          }
        }}
        aria-label={`Clear all ${selectedValues.length} selected options`}
        {...stylex.props(styles.clearAllButton)}
      >
        <XIcon {...stylex.props(styles.clearIcon)} />
      </div>
      <Separator orientation="vertical" sx={styles.separator} />
      <ChevronDown {...stylex.props(styles.chevronIcon)} aria-hidden="true" />
    </div>
  </div>
);

export const PlaceholderContent = ({ placeholder }: { placeholder: string }) => (
  <div {...stylex.props(styles.placeholderContainer)}>
    <Text as="span" type="secondary" sx={styles.placeholderText}>
      {placeholder}
    </Text>
    <ChevronDown {...stylex.props(styles.placeholderChevron)} />
  </div>
);

interface OptionsContentProps {
  filteredOptions: MultiSelectOption[] | MultiSelectGroup[];
  hideSelectAll: boolean;
  searchValue: string;
  searchable: boolean;
  selectedValues: string[];
  getAllOptions: () => MultiSelectOption[];
  toggleAll: () => void;
  toggleOption: (value: string) => void;
  handleClear: () => void;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
  handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  setSearchValue: Dispatch<SetStateAction<string>>;
  multiSelectId: string;
  emptyIndicator?: ReactNode;
  screenSize: ScreenSize;
}

export const OptionsContent = ({
  filteredOptions,
  hideSelectAll,
  searchValue,
  searchable,
  selectedValues,
  getAllOptions,
  toggleAll,
  toggleOption,
  handleClear,
  setIsPopoverOpen,
  handleInputKeyDown,
  setSearchValue,
  multiSelectId,
  emptyIndicator,
}: OptionsContentProps) => (
  <Command>
    {searchable && (
      <CommandInput
        placeholder="Search options..."
        onKeyDown={handleInputKeyDown}
        value={searchValue}
        onValueChange={setSearchValue}
        aria-label="Search through available options"
        aria-describedby={`${multiSelectId}-search-help`}
      />
    )}
    {searchable && (
      <div id={`${multiSelectId}-search-help`} {...stylex.props(styles.srOnly)}>
        Type to filter options. Use arrow keys to navigate results.
      </div>
    )}
    <CommandList>
      <CommandEmpty>{emptyIndicator || 'No results found.'}</CommandEmpty>{' '}
      {!hideSelectAll && !searchValue && (
        <CommandGroup>
          <CommandItem
            key="all"
            onSelect={toggleAll}
            role="option"
            aria-selected={
              selectedValues.length === getAllOptions().filter((opt) => !opt.disabled).length
            }
            aria-label={`Select all ${getAllOptions().length} options`}
          >
            <div
              {...stylex.props(
                styles.checkboxContainer,
                selectedValues.length === getAllOptions().filter((opt) => !opt.disabled).length
                  ? styles.checkboxChecked
                  : styles.checkboxUnchecked,
              )}
              aria-hidden="true"
            >
              <CheckIcon {...stylex.props(styles.checkIcon)} />
            </div>
            <Text as="span" type="inherit">
              (Select All
              {getAllOptions().length > 20 ? ` - ${getAllOptions().length} options` : ''})
            </Text>
          </CommandItem>
        </CommandGroup>
      )}
      {isGroupedOptions(filteredOptions) ? (
        filteredOptions.map((group) => (
          <CommandGroup key={group.heading} heading={group.heading}>
            {group.options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleOption(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  aria-label={`${option.label}${isSelected ? ', selected' : ', not selected'}${option.disabled ? ', disabled' : ''}`}
                  disabled={option.disabled}
                >
                  <div
                    {...stylex.props(
                      styles.checkboxContainer,
                      isSelected ? styles.checkboxChecked : styles.checkboxUnchecked,
                    )}
                    aria-hidden="true"
                  >
                    <CheckIcon {...stylex.props(styles.checkIcon)} />
                  </div>
                  {option.icon && (
                    <option.icon {...stylex.props(styles.optionIcon)} aria-hidden="true" />
                  )}
                  <Text ellipsis tooltip sx={styles.optionLabelText}>
                    {option.label}
                  </Text>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))
      ) : (
        <CommandGroup>
          {filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                aria-label={`${option.label}${isSelected ? ', selected' : ', not selected'}${option.disabled ? ', disabled' : ''}`}
                disabled={option.disabled}
              >
                <div
                  {...stylex.props(
                    styles.checkboxContainer,
                    isSelected ? styles.checkboxChecked : styles.checkboxUnchecked,
                  )}
                  aria-hidden="true"
                >
                  <CheckIcon {...stylex.props(styles.checkIcon)} />
                </div>
                {option.icon && (
                  <option.icon {...stylex.props(styles.optionIcon)} aria-hidden="true" />
                )}
                <Text ellipsis tooltip sx={styles.optionLabelText}>
                  {option.label}
                </Text>
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
      <CommandSeparator />
      <CommandGroup>
        <div {...stylex.props(styles.footerActions)}>
          {selectedValues.length > 0 && (
            <>
              <CommandItem onSelect={handleClear} sx={styles.footerActionItem}>
                Clear
              </CommandItem>
              <Separator orientation="vertical" sx={styles.separator} />
            </>
          )}
          <CommandItem onSelect={() => setIsPopoverOpen(false)} sx={styles.footerActionItem}>
            Close
          </CommandItem>
        </div>
      </CommandGroup>
    </CommandList>
  </Command>
);
