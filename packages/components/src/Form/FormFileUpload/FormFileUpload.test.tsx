import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm, FormProvider, type UseFormReturn, type FieldValues } from 'react-hook-form';
import { FormFileUpload } from './index';

describe('FormFileUpload', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-avatar');
    global.URL.revokeObjectURL = vi.fn();
  });

  const FormWrapper = <TFieldValues extends FieldValues = { file: unknown }>({
    children,
    defaultValues = { file: null } as unknown as TFieldValues,
  }: {
    children: React.ReactNode;
    defaultValues?: TFieldValues;
  }) => {
    const methods = useForm<TFieldValues>({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it('should render form control with label and description', () => {
    render(
      <FormWrapper>
        <FormFileUpload
          name="file"
          label="Profile Document"
          description="Upload your document here"
        />
      </FormWrapper>,
    );

    expect(screen.getByText('Profile Document')).toBeInTheDocument();
    expect(screen.getByText('Upload your document here')).toBeInTheDocument();
    expect(screen.getByText('Drag & drop files here, or click to select')).toBeInTheDocument();
  });

  it('should support avatar variant within FormBase', () => {
    render(
      <FormWrapper>
        <FormFileUpload name="avatar" label="Profile Picture" variant="avatar" />
      </FormWrapper>,
    );

    expect(screen.getByText('Profile Picture')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('should handle autoUpload with a custom uploadFile function', async () => {
    const mockFile = new File(['image-data'], 'test.png', { type: 'image/png' });
    const mockUploadFn = vi.fn().mockResolvedValue('https://cdn.example.com/test.png');

    let formState: UseFormReturn<{ file: unknown }> | undefined;

    const TestForm = () => {
      const methods = useForm<{ file: unknown }>({ defaultValues: { file: null } });
      formState = methods;
      return (
        <FormProvider {...methods}>
          <FormFileUpload name="file" label="Avatar" autoUpload uploadFile={mockUploadFn} />
        </FormProvider>
      );
    };

    render(<TestForm />);

    const dropzone = screen.getByRole('region');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [mockFile],
      },
    });

    await waitFor(() => {
      expect(mockUploadFn).toHaveBeenCalledWith(mockFile);
    });

    await waitFor(() => {
      expect(formState?.getValues('file')).toBe('https://cdn.example.com/test.png');
    });
  });

  it('should handle manual upload mode emitting raw File object to form', async () => {
    const mockFile = new File(['manual-content'], 'manual.png', {
      type: 'image/png',
    });

    let formState: UseFormReturn<{ file: unknown }> | undefined;

    const TestForm = () => {
      const methods = useForm<{ file: unknown }>({ defaultValues: { file: null } });
      formState = methods;
      return (
        <FormProvider {...methods}>
          <FormFileUpload name="file" label="Attachment" />
        </FormProvider>
      );
    };

    render(<TestForm />);

    const dropzone = screen.getByRole('region');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [mockFile],
      },
    });

    await waitFor(() => {
      expect(formState?.getValues('file')).toBe(mockFile);
    });
  });

  it('should support multiple files with image previews and update form state with an array', async () => {
    const file1 = new File(['img1'], 'photo1.png', { type: 'image/png' });
    const file2 = new File(['img2'], 'photo2.jpg', { type: 'image/jpeg' });

    let formState: UseFormReturn<{ docs: unknown }> | undefined;

    const MultiForm = () => {
      const methods = useForm<{ docs: unknown }>({ defaultValues: { docs: null } });
      formState = methods;
      return (
        <FormProvider {...methods}>
          <FormFileUpload name="docs" label="Documents" maxFiles={3} accept="image/*" showPreview />
        </FormProvider>
      );
    };

    render(<MultiForm />);

    const dropzone = screen.getByRole('region');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file1, file2],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('photo1.png')).toBeInTheDocument();
      expect(screen.getByText('photo2.jpg')).toBeInTheDocument();
    });

    // Check preview images rendered for both uploaded image files
    const images = screen.getAllByRole('img');
    const imageAlts = images.map((img) => img.getAttribute('alt'));
    expect(imageAlts).toContain('photo1.png');
    expect(imageAlts).toContain('photo2.jpg');

    await waitFor(() => {
      const formValue = formState?.getValues('docs') as File[];
      expect(Array.isArray(formValue)).toBe(true);
      expect(formValue).toHaveLength(2);
      expect(formValue[0]).toBe(file1);
      expect(formValue[1]).toBe(file2);
    });
  });
});
