import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComponentWidthPresetMap, resolveWidth } from './width';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormItem } from '../ui/form';
import { Select as BaseSelect } from '../index';
import { Select as UiSelect, SelectTrigger } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Field } from '../ui/field';

describe('ComponentWidth & resolveWidth', () => {
  describe('resolveWidth utility', () => {
    it('should return undefined for undefined or null', () => {
      expect(resolveWidth(undefined)).toBeUndefined();
      expect(resolveWidth(null as unknown as undefined)).toBeUndefined();
    });

    it('should convert number values to pixel strings', () => {
      expect(resolveWidth(0)).toBe('0px');
      expect(resolveWidth(100)).toBe('100px');
      expect(resolveWidth(250)).toBe('250px');
      expect(resolveWidth(480)).toBe('480px');
    });

    it('should resolve semantic layout presets', () => {
      expect(resolveWidth('full')).toBe('100%');
      expect(resolveWidth('auto')).toBe('auto');
      expect(resolveWidth('fit')).toBe('fit-content');
      expect(resolveWidth('max')).toBe('max-content');
      expect(resolveWidth('min')).toBe('min-content');
      expect(resolveWidth('screen')).toBe('100vw');
    });

    it('should resolve standard sizing scale presets', () => {
      expect(resolveWidth('xxs')).toBe('6rem');
      expect(resolveWidth('xs')).toBe('8rem');
      expect(resolveWidth('sm')).toBe('12rem');
      expect(resolveWidth('md')).toBe('16rem');
      expect(resolveWidth('lg')).toBe('20rem');
      expect(resolveWidth('xl')).toBe('24rem');
      expect(resolveWidth('xxl')).toBe('32rem');
    });

    it('should resolve fractional presets', () => {
      expect(resolveWidth('1/2')).toBe('50%');
      expect(resolveWidth('1/3')).toBe('33.333333%');
      expect(resolveWidth('2/3')).toBe('66.666667%');
      expect(resolveWidth('1/4')).toBe('25%');
      expect(resolveWidth('3/4')).toBe('75%');
    });

    it('should pass through custom CSS strings untouched', () => {
      expect(resolveWidth('250px')).toBe('250px');
      expect(resolveWidth('18rem')).toBe('18rem');
      expect(resolveWidth('50vw')).toBe('50vw');
      expect(resolveWidth('calc(100% - 24px)')).toBe('calc(100% - 24px)');
    });

    it('should have correct mapping in ComponentWidthPresetMap', () => {
      expect(ComponentWidthPresetMap.full).toBe('100%');
      expect(ComponentWidthPresetMap.auto).toBe('auto');
      expect(ComponentWidthPresetMap.md).toBe('16rem');
    });
  });

  describe('Component width integration', () => {
    describe('Button', () => {
      it('should apply preset width to Button', () => {
        render(<Button width="full">Full Width Button</Button>);
        const btn = screen.getByRole('button', { name: /Full Width Button/i });
        expect(btn).toHaveAttribute('data-width', 'full');
        expect(btn).toHaveStyle({ width: '100%' });
      });

      it('should apply numeric width (in px) to Button', () => {
        render(<Button width={240}>Numeric Width Button</Button>);
        const btn = screen.getByRole('button', { name: /Numeric Width Button/i });
        expect(btn).toHaveAttribute('data-width', '240');
        expect(btn).toHaveStyle({ width: '240px' });
      });

      it('should apply custom string width to Button', () => {
        render(<Button width="15rem">Custom String Width Button</Button>);
        const btn = screen.getByRole('button', { name: /Custom String Width Button/i });
        expect(btn.style.width).toBe('15rem');
      });
    });

    describe('Input', () => {
      it('should apply preset width to standalone Input', () => {
        render(<Input placeholder="Standalone" width="md" />);
        const input = screen.getByPlaceholderText('Standalone');
        expect(input).toHaveAttribute('data-width', 'md');
        expect(input.style.width).toBe('16rem');
      });

      it('should apply numeric width to standalone Input', () => {
        render(<Input placeholder="Numeric Input" width={320} />);
        const input = screen.getByPlaceholderText('Numeric Input');
        expect(input).toHaveAttribute('data-width', '320');
        expect(input).toHaveStyle({ width: '320px' });
      });

      it('should apply width to composite Input with prefix addon', () => {
        render(<Input placeholder="With Addon" prefix="🔍" width={280} />);
        const container = screen
          .getByPlaceholderText('With Addon')
          .closest('[data-slot="input-wrapper"]') as HTMLElement;
        expect(container).toHaveAttribute('data-width', '280');
        expect(container).toHaveStyle({ width: '280px' });
      });
    });

    describe('FormItem', () => {
      it('should apply preset width to FormItem', () => {
        render(
          <FormItem width="full" data-testid="form-item">
            <span>Item content</span>
          </FormItem>,
        );
        const item = screen.getByTestId('form-item');
        expect(item).toHaveAttribute('data-width', 'full');
        expect(item.style.width).toBe('100%');
      });

      it('should apply numeric width to FormItem', () => {
        render(
          <FormItem width={360} data-testid="form-item-num">
            <span>Item content</span>
          </FormItem>,
        );
        const item = screen.getByTestId('form-item-num');
        expect(item).toHaveAttribute('data-width', '360');
        expect(item).toHaveStyle({ width: '360px' });
      });
    });

    describe('Select', () => {
      it('should apply numeric width to BaseSelect trigger', () => {
        render(
          <BaseSelect options={[{ label: 'A', value: 'a' }]} width={250} placeholder="Choose..." />,
        );
        const trigger = screen.getByRole('button');
        expect(trigger).toHaveAttribute('data-width', '250');
        expect(trigger).toHaveStyle({ width: '250px' });
      });

      it('should apply preset width to BaseSelect trigger', () => {
        render(
          <BaseSelect
            options={[{ label: 'A', value: 'a' }]}
            width="full"
            placeholder="Choose..."
          />,
        );
        const trigger = screen.getByRole('button');
        expect(trigger).toHaveAttribute('data-width', 'full');
        expect(trigger.style.width).toBe('100%');
      });

      it('should apply width to Radix SelectTrigger', () => {
        render(
          <UiSelect>
            <SelectTrigger width={200} data-testid="radix-trigger">
              <span>Trigger</span>
            </SelectTrigger>
          </UiSelect>,
        );
        const trigger = screen.getByTestId('radix-trigger');
        expect(trigger).toHaveAttribute('data-width', '200');
        expect(trigger).toHaveStyle({ width: '200px' });
      });
    });

    describe('Textarea', () => {
      it('should apply width to Textarea', () => {
        render(<Textarea placeholder="Notes" width={400} />);
        const textarea = screen.getByPlaceholderText('Notes');
        expect(textarea).toHaveAttribute('data-width', '400');
        expect(textarea).toHaveStyle({ width: '400px' });
      });

      it('should apply preset width to Textarea', () => {
        render(<Textarea placeholder="Full Notes" width="full" />);
        const textarea = screen.getByPlaceholderText('Full Notes');
        expect(textarea).toHaveAttribute('data-width', 'full');
        expect(textarea.style.width).toBe('100%');
      });
    });

    describe('Field', () => {
      it('should apply width to Field container', () => {
        render(
          <Field width="lg" data-testid="field-lg">
            Field
          </Field>,
        );
        const field = screen.getByTestId('field-lg');
        expect(field).toHaveAttribute('data-width', 'lg');
        expect(field.style.width).toBe('20rem');
      });
    });
  });
});
