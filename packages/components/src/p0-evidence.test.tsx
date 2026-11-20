import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';

import { BadgeOverflow } from './ui/badge-overflow';
import { Avatar, AvatarFallback, AvatarGroup } from './ui/avatar';
import { createStore } from './ui/file-upload';
import { Pagination, PaginationContent, PaginationEllipsis } from './ui/pagination';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from './ui/breadcrumb';
import { Stepper, StepperContent, StepperItem, StepperTrigger } from './ui/stepper';
import { FormBase, FormInput } from './Form/Form';
import { FormDatePicker } from './Form/FormDatePicker';
import { SingleDatePicker } from './Form/FormDatePicker/SingleDatePicker';
import { DataTable } from './DataTable/DataTable';
import type { ColumnDef } from '@tanstack/react-table';

describe('Review P0 Fixes Evidence Suite', () => {
  describe('F-002: BadgeOverflow accessible button trigger', () => {
    it('should render overflow trigger as a focusable button with accessible name', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
      render(<BadgeOverflow items={items} max={3} showPopover />);

      const overflowButton = screen.getByRole('button', { name: /\+2 more items/i });
      expect(overflowButton).toBeInTheDocument();
      expect(overflowButton).toHaveAttribute('type', 'button');
    });
  });

  describe('F-003: AvatarGroup accessible button trigger', () => {
    it('should render overflow count as a focusable button with accessible name', () => {
      render(
        <AvatarGroup max={2}>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
        </AvatarGroup>,
      );

      const overflowButton = screen.getByRole('button', { name: /\+2 more members/i });
      expect(overflowButton).toBeInTheDocument();
      expect(overflowButton).toHaveAttribute('type', 'button');
    });
  });

  describe('F-030: FileUpload store Map immutability', () => {
    it('should emit a new Map reference on SET_PROGRESS so subscribers detect changes', () => {
      const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
      const initialFiles = new Map([
        [mockFile, { file: mockFile, progress: 0, status: 'idle' as const }],
      ]);
      const store = createStore(new Set(), initialFiles, new WeakMap(), false);
      const initialMap = store.getState().files;

      store.dispatch({
        type: 'SET_PROGRESS',
        file: mockFile,
        progress: 50,
      });

      const updatedMap = store.getState().files;
      expect(updatedMap).not.toBe(initialMap);
      expect(updatedMap.get(mockFile)?.progress).toBe(50);
      expect(updatedMap.get(mockFile)?.status).toBe('uploading');
    });
  });

  describe('F-056: PaginationEllipsis screen reader announcement', () => {
    it('should include accessible screen reader text not suppressed by aria-hidden', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationEllipsis />
          </PaginationContent>
        </Pagination>,
      );

      const srText = screen.getByText(/more pages/i);
      expect(srText).toBeInTheDocument();
      expect(srText.closest('[aria-hidden="true"]')).toBeNull();
    });
  });

  describe('F-005: BreadcrumbPage ARIA current', () => {
    it('should render breadcrumb page with aria-current="page" without invalid role="link"', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const currentPage = screen.getByText('Current Page');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
      expect(currentPage).not.toHaveAttribute('role', 'link');
    });
  });

  describe('F-078: Stepper ARIA wiring and forceMount hidden', () => {
    it('should associate tab and panel via aria-controls and aria-labelledby with proper hidden attribute', () => {
      render(
        <Stepper defaultValue="step-1">
          <StepperItem value="step-1">
            <StepperTrigger>Step 1</StepperTrigger>
          </StepperItem>
          <StepperItem value="step-2">
            <StepperTrigger>Step 2</StepperTrigger>
          </StepperItem>
          <StepperContent value="step-1" forceMount>
            Panel 1 Content
          </StepperContent>
          <StepperContent value="step-2" forceMount>
            Panel 2 Content
          </StepperContent>
        </Stepper>,
      );

      const tab1 = screen.getByRole('tab', { name: /step 1/i });
      const tab2 = screen.getByRole('tab', { name: /step 2/i });

      expect(tab1).toHaveAttribute('aria-controls', 'stepper-panel-step-1');
      expect(tab1).toHaveAttribute('tabindex', '0');
      expect(tab2).toHaveAttribute('aria-controls', 'stepper-panel-step-2');
      expect(tab2).toHaveAttribute('tabindex', '-1');

      const allPanels = document.querySelectorAll('[role="tabpanel"]');
      expect(allPanels[0]).toHaveAttribute('aria-labelledby', 'stepper-tab-step-1');
      expect(allPanels[0]).not.toHaveAttribute('hidden');
      expect(allPanels[1]).toHaveAttribute('aria-labelledby', 'stepper-tab-step-2');
      expect(allPanels[1]).toHaveAttribute('hidden');
    });
  });

  describe('F-119 & F-120: FormDatePicker accessibility and clear button', () => {
    it('should forward id and aria attributes from FormControl to the trigger button', () => {
      function TestForm() {
        const methods = useForm({ defaultValues: { dateField: undefined } });
        return (
          <FormProvider {...methods}>
            <form>
              <FormDatePicker control={methods.control} name="dateField" label="Birthday" />
            </form>
          </FormProvider>
        );
      }

      render(<TestForm />);
      const label = screen.getByText('Birthday');
      const triggerButton = screen.getByRole('button', { name: /birthday/i });

      expect(label).toHaveAttribute('for');
      const labelFor = label.getAttribute('for');
      expect(triggerButton).toHaveAttribute('id', labelFor);
      expect(triggerButton).toHaveAttribute('aria-describedby');
      expect(triggerButton).toHaveAttribute('aria-invalid', 'false');
    });

    it('should render clear affordance with role="button" and tabIndex={0}', () => {
      const onClear = vi.fn();
      render(<SingleDatePicker value={new Date(2026, 0, 1)} allowClear onChange={onClear} />);

      const clearButton = screen.getByRole('button', { name: /clear date/i });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveAttribute('tabindex', '0');

      fireEvent.click(clearButton);
      expect(onClear).toHaveBeenCalledWith(undefined);
    });
  });

  describe('F-123: FormInput password visibility toggle', () => {
    it('should render password toggle as a focusable button with descriptive aria-label', () => {
      function PasswordForm() {
        const methods = useForm({ defaultValues: { password: 'secret' } });
        return (
          <FormProvider {...methods}>
            <form>
              <FormBase control={methods.control} name="password" label="Password">
                {(field) => <FormInput {...field} htmlType="password" />}
              </FormBase>
            </form>
          </FormProvider>
        );
      }

      render(<PasswordForm />);
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).not.toHaveAttribute('tabindex', '-1');

      fireEvent.click(toggleButton);
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
    });
  });

  describe('F-180: DataTable accessorKey-only columns render TableHead', () => {
    it('should render TableHead even when columnDef header is undefined', () => {
      interface TestData {
        id: string;
        userEmail: string;
      }

      const columns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'userEmail',
          // Note: header is intentionally undefined to verify F-180
        },
      ];

      const data: TestData[] = [{ id: '1', userEmail: 'user@example.com' }];

      render(<DataTable columns={columns} data={data} total={1} />);

      const tableHeads = screen.getAllByRole('columnheader');
      expect(tableHeads).toHaveLength(1);
      expect(tableHeads[0]).toHaveTextContent('userEmail');
    });
  });
});
