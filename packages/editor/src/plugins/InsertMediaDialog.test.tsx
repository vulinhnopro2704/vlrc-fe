import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InsertMediaDialog } from './InsertMediaDialog';

describe('InsertMediaDialog', () => {
  it('should not render anything when closed', () => {
    const { container } = render(
      <InsertMediaDialog open={false} type="image" onOpenChange={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render image insert dialog with default values', () => {
    render(
      <InsertMediaDialog open={true} type="image" onOpenChange={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(screen.getByText('Insert Image')).toBeInTheDocument();
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Caption (Optional)')).toBeInTheDocument();
  });

  it('should render youtube embed dialog without caption field', () => {
    render(
      <InsertMediaDialog open={true} type="youtube" onOpenChange={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(screen.getByText('Embed YouTube Video')).toBeInTheDocument();
    expect(screen.getByLabelText('Video ID or URL')).toBeInTheDocument();
    expect(screen.queryByLabelText('Caption (Optional)')).not.toBeInTheDocument();
  });

  it('should call onConfirm with entered data when submitted', () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <InsertMediaDialog
        open={true}
        type="image"
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    );

    const input = screen.getByLabelText('Image URL');
    fireEvent.change(input, { target: { value: 'https://example.com/test.png' } });

    const captionInput = screen.getByLabelText('Caption (Optional)');
    fireEvent.change(captionInput, { target: { value: 'Test Caption' } });

    fireEvent.click(screen.getByRole('button', { name: 'Insert' }));

    expect(onConfirm).toHaveBeenCalledWith({
      type: 'image',
      url: 'https://example.com/test.png',
      caption: 'Test Caption',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
