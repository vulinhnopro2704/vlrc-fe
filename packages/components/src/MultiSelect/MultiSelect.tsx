import { type FunctionComponent } from 'react';
import * as stylex from '@stylexjs/stylex';
import Icons from '../Icons';
import { colors, radius } from '../theme/tokens.stylex';

import { cn } from '../utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LiveRegion, OptionsContent, PlaceholderContent, SelectedValuesContent } from './renderers';
import { useMultiSelect } from './useMultiSelect';
import { type MultiSelectProps } from './type';

const styles = stylex.create({
  triggerButton: {
    display: 'flex',
    padding: '0.25rem',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    minHeight: '2.5rem',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'inherit',
    ':hover': {
      backgroundColor: 'inherit',
    },
  },
  triggerAutoSize: {
    width: 'auto',
  },
  triggerFullWidth: {
    width: '100%',
  },
  triggerCompact: {
    minHeight: '2rem',
    fontSize: '0.875rem',
  },
  triggerMobile: {
    minHeight: '3rem',
    fontSize: '1rem',
  },
  triggerDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  popoverContent: {
    width: 'auto',
    padding: 0,
    touchAction: 'manipulation',
  },
  popoverMobile: {
    width: '85vw',
    maxWidth: '17.5rem',
  },
  popoverTablet: {
    width: '70vw',
    maxWidth: '28rem',
  },
  popoverDesktop: {
    minWidth: '18.75rem',
  },
  wandIcon: {
    cursor: 'pointer',
    marginBlock: '0.5rem',
    color: colors.foreground,
    backgroundColor: colors.background,
    width: '0.75rem',
    height: '0.75rem',
  },
  wandIconInactive: {
    color: colors.mutedForeground,
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

const MultiSelect: FunctionComponent<MultiSelectProps> = ({
  options,
  onValueChange,
  variant,
  defaultValue = [],
  value,
  placeholder = 'Select options',
  animation = 0,
  animationConfig,
  maxCount = 3,
  modalPopover = false,
  className,
  hideSelectAll = false,
  searchable = true,
  emptyIndicator,
  autoSize = false,
  singleLine = false,
  popoverClassName,
  disabled = false,
  responsive,
  width,
  minWidth,
  maxWidth,
  deduplicateOptions = false,
  resetOnDefaultValueChange = true,
  closeOnSelect = false,
  ref,
  ...buttonProps
}) => {
  const { ids, state, derived, refs, helpers, a11yMessages, handlers } = useMultiSelect({
    options,
    onValueChange,
    defaultValue: value || defaultValue,
    animation,
    animationConfig,
    maxCount,
    modalPopover,
    hideSelectAll,
    searchable,
    autoSize,
    disabled,
    responsive,
    minWidth,
    maxWidth,
    deduplicateOptions,
    resetOnDefaultValueChange,
    closeOnSelect,
    forwardedRef: ref,
  });

  const { selectedValues, isPopoverOpen, isAnimating, searchValue, screenSize } = state;
  const {
    filteredOptions,
    responsiveSettings,
    widthConstraints,
    badgeAnimationClass,
    popoverAnimationClass,
  } = derived;
  const { buttonRef } = refs;
  const { getAllOptions, getOptionByValue } = helpers;
  const { politeMessage, assertiveMessage } = a11yMessages;
  const {
    setIsPopoverOpen,
    handleTogglePopover,
    handleInputKeyDown,
    toggleOption,
    handleClear,
    clearExtraOptions,
    toggleAll,
    setSearchValue,
    setIsAnimating,
  } = handlers;

  const handlePopoverChange = (open: boolean) => {
    if (disabled) return;
    setIsPopoverOpen(open);
  };

  const ariaLabel = `Multi-select: ${selectedValues.length} of ${getAllOptions().length} options selected. ${placeholder}`;

  return (
    <>
      <LiveRegion politeMessage={politeMessage} assertiveMessage={assertiveMessage} />

      <Popover open={isPopoverOpen} onOpenChange={handlePopoverChange} modal={modalPopover}>
        <div id={ids.triggerDescriptionId} {...stylex.props(styles.srOnly)}>
          Multi-select dropdown. Use arrow keys to navigate, Enter to select, and Escape to close.
        </div>
        <div id={ids.selectedCountId} {...stylex.props(styles.srOnly)} aria-live="polite">
          {selectedValues.length === 0
            ? 'No options selected'
            : `${selectedValues.length} option${
                selectedValues.length === 1 ? '' : 's'
              } selected: ${selectedValues
                .map((val) => getOptionByValue(val)?.label)
                .filter(Boolean)
                .join(', ')}`}
        </div>

        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            width={width}
            {...buttonProps}
            onClick={handleTogglePopover}
            disabled={disabled}
            role="combobox"
            aria-expanded={isPopoverOpen}
            aria-haspopup="listbox"
            aria-controls={isPopoverOpen ? ids.listboxId : undefined}
            aria-describedby={`${ids.triggerDescriptionId} ${ids.selectedCountId}`}
            aria-label={ariaLabel}
            sx={[
              styles.triggerButton,
              autoSize ? styles.triggerAutoSize : styles.triggerFullWidth,
              responsiveSettings.compactMode ? styles.triggerCompact : undefined,
              screenSize === 'mobile' ? styles.triggerMobile : undefined,
              disabled ? styles.triggerDisabled : undefined,
            ]}
            className={className}
            style={{
              ...widthConstraints,
              maxWidth: `min(${widthConstraints.maxWidth}, 100%)`,
            }}
          >
            {selectedValues.length > 0 ? (
              <SelectedValuesContent
                selectedValues={selectedValues}
                responsiveSettings={responsiveSettings}
                screenSize={screenSize}
                singleLine={singleLine}
                animation={animation}
                animationConfig={animationConfig}
                badgeAnimationClass={badgeAnimationClass}
                variant={variant}
                getOptionByValue={getOptionByValue}
                toggleOption={toggleOption}
                clearExtraOptions={clearExtraOptions}
                handleClear={handleClear}
              />
            ) : (
              <PlaceholderContent placeholder={placeholder} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={ids.listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-label="Available options"
          sx={[
            styles.popoverContent,
            screenSize === 'mobile'
              ? styles.popoverMobile
              : screenSize === 'tablet'
                ? styles.popoverTablet
                : styles.popoverDesktop,
          ]}
          className={cn(popoverAnimationClass, popoverClassName)}
          style={{
            animationDuration: `${animationConfig?.duration || animation}s`,
            animationDelay: `${animationConfig?.delay || 0}s`,
            maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
            maxHeight: screenSize === 'mobile' ? '70vh' : '60vh',
          }}
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <OptionsContent
            filteredOptions={filteredOptions}
            hideSelectAll={hideSelectAll}
            searchValue={searchValue}
            searchable={searchable}
            selectedValues={selectedValues}
            getAllOptions={getAllOptions}
            toggleAll={toggleAll}
            toggleOption={toggleOption}
            handleClear={handleClear}
            setIsPopoverOpen={setIsPopoverOpen}
            handleInputKeyDown={handleInputKeyDown}
            setSearchValue={setSearchValue}
            multiSelectId={ids.multiSelectId}
            emptyIndicator={emptyIndicator}
            screenSize={screenSize}
          />
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <Icons.WandSparkles
            {...stylex.props(styles.wandIcon, !isAnimating && styles.wandIconInactive)}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    </>
  );
};

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;
