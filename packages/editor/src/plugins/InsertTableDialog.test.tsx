// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InsertTableDialog } from './InsertTableDialog';

describe('InsertTableDialog', () => {
  it('should render dialog with default rows and columns when open is true', () => {
    render(<InsertTableDialog open={true} onOpenChange={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Insert Table' })).toBeInTheDocument();
    expect(screen.getByLabelText('Rows')).toHaveValue(4);
    expect(screen.getByLabelText('Columns')).toHaveValue(4);
    expect(screen.getByLabelText('Include Header Row')).toBeChecked();
  });

  it('should call onConfirm with configured dimensions on submit', () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(<InsertTableDialog open={true} onOpenChange={onOpenChange} onConfirm={onConfirm} />);

    const rowsInput = screen.getByLabelText('Rows');
    const colsInput = screen.getByLabelText('Columns');

    fireEvent.change(rowsInput, { target: { value: '6' } });
    fireEvent.change(colsInput, { target: { value: '5' } });

    const submitBtn = screen.getByRole('button', { name: 'Insert Table' });
    fireEvent.click(submitBtn);

    expect(onConfirm).toHaveBeenCalledWith({
      rows: '6',
      columns: '5',
      includeHeaders: true,
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onOpenChange with false when cancel button is clicked', () => {
    const onOpenChange = vi.fn();

    render(<InsertTableDialog open={true} onOpenChange={onOpenChange} onConfirm={vi.fn()} />);

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
