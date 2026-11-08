import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
  FileUploader,
} from './file-upload';

describe('FileUpload UI Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  describe('Primitives Composition', () => {
    it('should render dropzone with accessible attributes', () => {
      render(
        <FileUpload>
          <FileUploadDropzone data-testid="dropzone">
            <span>Drop here</span>
          </FileUploadDropzone>
        </FileUpload>,
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toBeInTheDocument();
      expect(dropzone).toHaveAttribute('role', 'region');
      expect(screen.getByText('Drop here')).toBeInTheDocument();
    });

    it('should display file item with name, size and preview', () => {
      const mockFile = new File(['test content'], 'sample-document.pdf', {
        type: 'application/pdf',
      });

      render(
        <FileUpload value={[mockFile]}>
          <FileUploadList>
            <FileUploadItem value={mockFile} data-testid="file-item">
              <FileUploadItemPreview data-testid="file-preview" />
              <FileUploadItemMetadata />
              <FileUploadItemDelete data-testid="delete-btn" />
            </FileUploadItem>
          </FileUploadList>
        </FileUpload>,
      );

      expect(screen.getByTestId('file-item')).toBeInTheDocument();
      expect(screen.getByText('sample-document.pdf')).toBeInTheDocument();
      expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
    });

    it('should trigger onFileReject when file exceeds maxSize', () => {
      const onFileReject = vi.fn();
      const largeFile = new File(['x'.repeat(2000)], 'large.png', {
        type: 'image/png',
      });
      // Override size property
      Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 });

      render(
        <FileUpload
          maxSize={1024 * 1024} // 1MB limit
          onFileReject={onFileReject}
        >
          <FileUploadDropzone data-testid="dropzone">
            <span>Dropzone</span>
          </FileUploadDropzone>
        </FileUpload>,
      );

      const dropzone = screen.getByTestId('dropzone');
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [largeFile],
        },
      });

      expect(onFileReject).toHaveBeenCalledWith(
        largeFile,
        expect.stringContaining('exceeds maximum allowed size'),
      );
    });

    it('should trigger onFileReject when mime type does not match accept', () => {
      const onFileReject = vi.fn();
      const textFile = new File(['plain text'], 'doc.txt', {
        type: 'text/plain',
      });

      render(
        <FileUpload accept="image/*" onFileReject={onFileReject}>
          <FileUploadDropzone data-testid="dropzone">
            <span>Dropzone</span>
          </FileUploadDropzone>
        </FileUpload>,
      );

      const dropzone = screen.getByTestId('dropzone');
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [textFile],
        },
      });

      expect(onFileReject).toHaveBeenCalledWith(
        textFile,
        expect.stringContaining('not an accepted format'),
      );
    });
  });

  describe('FileUploader Composite Component', () => {
    it('should render default variant with custom title and subtitle', () => {
      render(
        <FileUploader dropzoneTitle="Custom Upload Title" dropzoneSubtitle="Custom Subtitle" />,
      );

      expect(screen.getByText('Custom Upload Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('should render avatar variant', () => {
      render(<FileUploader variant="avatar" />);
      expect(screen.getByText('Upload photo')).toBeInTheDocument();
    });

    it('should render existing files in list with delete button', () => {
      const mockFile = new File(['image-bytes'], 'avatar.png', { type: 'image/png' });
      const onValueChange = vi.fn();

      render(<FileUploader value={[mockFile]} onValueChange={onValueChange} />);

      expect(screen.getByText('avatar.png')).toBeInTheDocument();
      const deleteBtn = screen.getByLabelText('Remove avatar.png');
      expect(deleteBtn).toBeInTheDocument();

      fireEvent.click(deleteBtn);
      expect(onValueChange).toHaveBeenCalledWith([]);
    });
  });
});
