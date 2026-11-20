import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InsertLinkDialog } from './InsertLinkDialog';

describe('InsertLinkDialog', () => {
  it('should not render anything when closed', () => {
    const { container } = render(
      <InsertLinkDialog open={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render dialog with input when open', () => {
    render(
      <InsertLinkDialog
        open={true}
        defaultUrl="https://google.com"
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByText('Insert Link')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toHaveValue('https://google.com');
  });

  it('should submit url on save', () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <InsertLinkDialog
        open={true}
        defaultUrl="https://google.com"
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    );

    const input = screen.getByLabelText('URL');
    fireEvent.change(input, { target: { value: 'https://github.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Link' }));

    expect(onConfirm).toHaveBeenCalledWith('https://github.com');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
