import { type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm, FormProvider, type UseFormReturn, type FieldValues } from 'react-hook-form';
import { FormFileUpload } from './index';
import { FileUpload } from './FileUpload';

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
    children: ReactNode;
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

  it('should display FieldError when a file exceeds maxSize in FormFileUpload and clear when valid file is selected', async () => {
    const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
    const oversizedFile = new File(['oversized'], 'heavy.png', { type: 'image/png' });
    Object.defineProperty(oversizedFile, 'size', { value: 3 * 1024 * 1024 }); // 3 MB

    const validFile = new File(['valid'], 'light.png', { type: 'image/png' });
    Object.defineProperty(validFile, 'size', { value: 500 * 1024 }); // 500 KB

    let formState: UseFormReturn<{ avatar: unknown }> | undefined;

    const TestForm = () => {
      const methods = useForm<{ avatar: unknown }>({ defaultValues: { avatar: null } });
      formState = methods;
      const _ = methods.formState.errors;
      return (
        <FormProvider {...methods}>
          <FormFileUpload name="avatar" label="Avatar" maxSize={MAX_SIZE_BYTES} />
        </FormProvider>
      );
    };

    render(<TestForm />);

    const dropzone = screen.getByRole('region');

    // Drop oversized file
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [oversizedFile],
      },
    });

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent('File "heavy.png" exceeds maximum allowed size of 1 MB');
    });

    expect(formState?.formState.errors.avatar?.message).toBe(
      'File "heavy.png" exceeds maximum allowed size of 1 MB',
    );

    // Now drop a valid file
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [validFile],
      },
    });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    expect(formState?.getValues('avatar')).toBe(validFile);
    expect(formState?.formState.errors.avatar).toBeUndefined();
  });

  it('should display FieldError when file exceeds maxSize in standalone FileUpload', async () => {
    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
    const oversizedFile = new File(['too-big'], 'large.png', { type: 'image/png' });
    Object.defineProperty(oversizedFile, 'size', { value: 6 * 1024 * 1024 }); // 6 MB

    const validFile = new File(['ok'], 'small.png', { type: 'image/png' });
    Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1 MB

    const onFileReject = vi.fn();
    const onAccept = vi.fn();

    render(<FileUpload maxSize={MAX_SIZE_BYTES} onFileReject={onFileReject} onAccept={onAccept} />);

    const dropzone = screen.getByRole('region');

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [oversizedFile],
      },
    });

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent('File "large.png" exceeds maximum allowed size of 2 MB');
    });

    expect(onFileReject).toHaveBeenCalledWith(
      oversizedFile,
      'File "large.png" exceeds maximum allowed size of 2 MB',
    );

    // Drop valid file to clear error
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [validFile],
      },
    });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    expect(onAccept).toHaveBeenCalledWith([validFile]);
  });

  it('should display FieldError when using control directly without FormProvider', async () => {
    const MAX_SIZE_BYTES = 1024 * 1024;
    const oversizedFile = new File(['oversized'], 'huge.png', { type: 'image/png' });
    Object.defineProperty(oversizedFile, 'size', { value: 2 * 1024 * 1024 });

    const StandaloneControlForm = () => {
      const { control } = useForm<{ file: unknown }>({ defaultValues: { file: null } });
      return (
        <FormFileUpload
          control={control}
          name="file"
          label="Upload File"
          maxSize={MAX_SIZE_BYTES}
        />
      );
    };

    render(<StandaloneControlForm />);
    const dropzone = screen.getByRole('region');

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [oversizedFile],
      },
    });

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent('File "huge.png" exceeds maximum allowed size of 1 MB');
    });
  });

  it('should render external error and errors props via FieldError', () => {
    const { rerender } = render(<FileUpload error="Single error message" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Single error message');

    rerender(<FileUpload errors={[{ message: 'First error' }, { message: 'Second error' }]} />);

    expect(screen.getByText('First error')).toBeInTheDocument();
    expect(screen.getByText('Second error')).toBeInTheDocument();
  });
});
