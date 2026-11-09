import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BaseSelect from './BaseSelect';
import type { BaseSelectOption, BaseSingleSelectProps } from './type';

// Suite-wide Constants
const DEFAULT_PLACEHOLDER = 'Select an option...';
const LONG_OPTION_LABEL =
  'Super exceptionally long option text that exceeds typical container boundaries and requires ellipsis truncation with tooltip on hover';
const SECOND_LONG_OPTION_LABEL =
  'Another extraordinarily long option label that should never break container boundaries or overflow layout';
const SHORT_OPTION_LABEL = 'Short Option';

const MOCK_OPTIONS: BaseSelectOption<string>[] = [
  { value: 'opt-long-1', label: LONG_OPTION_LABEL },
  { value: 'opt-long-2', label: SECOND_LONG_OPTION_LABEL },
  { value: 'opt-short', label: SHORT_OPTION_LABEL },
];

const createDefaultSingleProps = (
  overrides?: Partial<BaseSingleSelectProps<string>>,
): BaseSingleSelectProps<string> => ({
  options: MOCK_OPTIONS,
  placeholder: DEFAULT_PLACEHOLDER,
  onChange: vi.fn(),
  ...overrides,
});

describe('BaseSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UI', () => {
    it('should match snapshot in default unselected state', () => {
      const { asFragment } = render(<BaseSelect {...createDefaultSingleProps()} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with long text selected in trigger', () => {
      const { asFragment } = render(
        <BaseSelect {...createDefaultSingleProps({ value: 'opt-long-1' })} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { asFragment } = render(
        <BaseSelect {...createDefaultSingleProps({ disabled: true, value: 'opt-short' })} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should open dropdown options when trigger is clicked', () => {
      render(<BaseSelect {...createDefaultSingleProps()} />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.getByText(LONG_OPTION_LABEL)).toBeInTheDocument();
      expect(screen.getByText(SECOND_LONG_OPTION_LABEL)).toBeInTheDocument();
      expect(screen.getByText(SHORT_OPTION_LABEL)).toBeInTheDocument();
    });

    it('should display tooltip when hovering over an option with long text', async () => {
      render(<BaseSelect {...createDefaultSingleProps()} />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const optionTextEl = screen.getByText(LONG_OPTION_LABEL);
      expect(optionTextEl).toBeInTheDocument();

      // Trigger hover over option text
      fireEvent.pointerMove(optionTextEl);

      const tooltipEl = await screen.findByText(LONG_OPTION_LABEL, {
        selector: '[data-slot="tooltip-content"]',
      });
      expect(tooltipEl).toBeInTheDocument();
    });

    it('should select long text option, display it in trigger with ellipsis, and show tooltip on hover', async () => {
      const onChange = vi.fn();
      const { rerender } = render(<BaseSelect {...createDefaultSingleProps({ onChange })} />);

      // 1. Open dropdown
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      // 2. Click the long text option
      const optionToSelect = screen.getByText(LONG_OPTION_LABEL);
      fireEvent.click(optionToSelect);

      expect(onChange).toHaveBeenCalledWith('opt-long-1');

      // 3. Re-render with selected value to simulate controlled state
      rerender(<BaseSelect {...createDefaultSingleProps({ value: 'opt-long-1', onChange })} />);

      const triggerLabel = screen.getByText(LONG_OPTION_LABEL);
      expect(triggerLabel).toBeInTheDocument();
      expect(triggerLabel).toHaveAttribute('data-slot', 'typography-text');

      // 4. Hover over the selected text in trigger to verify tooltip displays full label
      fireEvent.pointerMove(triggerLabel);

      const triggerTooltip = await screen.findByText(LONG_OPTION_LABEL, {
        selector: '[data-slot="tooltip-content"]',
      });
      expect(triggerTooltip).toBeInTheDocument();
    });

    it('should clear selection when clear icon is clicked', () => {
      const onChange = vi.fn();
      render(
        <BaseSelect
          {...createDefaultSingleProps({
            value: 'opt-long-1',
            isClearable: true,
            onChange,
          })}
        />,
      );

      const clearButton = screen.getByRole('button').querySelector('svg');
      expect(clearButton).toBeInTheDocument();

      if (clearButton) {
        fireEvent.click(clearButton);
        expect(onChange).toHaveBeenCalledWith(undefined);
      }
    });

    it('should support multi-select with long text tags and display tooltips on hover', async () => {
      const onChange = vi.fn();

      render(
        <BaseSelect
          isMulti
          options={MOCK_OPTIONS}
          value={['opt-long-1']}
          onChange={onChange}
          placeholder="Multi select..."
        />,
      );

      const tagText = screen.getByText(LONG_OPTION_LABEL);
      expect(tagText).toBeInTheDocument();

      fireEvent.pointerMove(tagText);

      const tagTooltip = await screen.findByText(LONG_OPTION_LABEL, {
        selector: '[data-slot="tooltip-content"]',
      });
      expect(tagTooltip).toBeInTheDocument();
    });
  });
});
