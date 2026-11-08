import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  FileUploader,
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  createApiUploadHandler,
  type UploadedFile,
} from './file-upload';
import { FormFileUpload } from '../Form/FormFileUpload';
import { Button } from './button';
import { Icons } from '../Icons';
import { Text, Title } from '../Typography';

const meta = {
  title: 'UI/FileUpload',
  component: FileUploader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modern, accessible File Upload component styled with Meta StyleX. Supports Drag & Drop, previews, progress bars, UploadThing (AWS S3), and custom backend storage APIs with real-time progress.',
      },
    },
  },
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {
  render: () => {
    return (
      <div style={{ width: '450px' }}>
        <FileUploader
          maxFiles={3}
          maxSize={5 * 1024 * 1024}
          dropzoneTitle="Drag & drop images here, or browse"
          dropzoneSubtitle="Up to 3 images (max 5 MB each)"
        />
      </div>
    );
  },
};

export const AvatarVariant: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <FileUploader variant="avatar" accept="image/*" maxSize={2 * 1024 * 1024} />
      </div>
    );
  },
};

export const CompactVariant: Story = {
  render: () => {
    return (
      <div style={{ width: '450px' }}>
        <FileUploader
          variant="compact"
          maxFiles={4}
          maxSize={8 * 1024 * 1024}
          dropzoneTitle="Select or drop attachments"
          dropzoneSubtitle="Up to 4 files (max 8 MB each)"
          showClear
        />
      </div>
    );
  },
};

export const CustomApiUpload: Story = {
  render: () => {
    // Simulated custom backend API upload handler
    const mockApiHandler = createApiUploadHandler({
      endpoint: '/api/v1/files/upload',
      method: 'POST',
      fieldName: 'attachment',
      responseParser: (_res: unknown, file: File) => ({
        key: file.name,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `https://storage.vlrc.vn/${file.name}`,
      }),
    });

    return (
      <div style={{ width: '450px' }}>
        <FileUploader
          maxFiles={2}
          uploadHandler={mockApiHandler}
          dropzoneTitle="Upload to Custom Backend API"
          dropzoneSubtitle="Supports real-time upload progress via XMLHttpRequest"
          showClear
        />
      </div>
    );
  },
};

export const UploadThingAWSExample: Story = {
  render: () => {
    // Example demonstrating UploadThing configuration
    interface UploadThingMockOptions {
      files: File[];
      onUploadProgress?: (data: { file: File; progress: number }) => void;
    }

    const dummyUploadThingConfig = {
      uploadFiles: async (
        _endpoint: string,
        options: UploadThingMockOptions,
      ): Promise<UploadedFile[]> => {
        const file = options.files[0]!;
        for (let pct = 20; pct <= 100; pct += 20) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          options.onUploadProgress?.({ file, progress: pct });
        }
        return options.files.map((f: File) => ({
          key: f.name,
          name: f.name,
          size: f.size,
          type: f.type,
          url: `https://utfs.io/f/${f.name}`,
        }));
      },
      endpoint: 'imageUploader',
    };

    return (
      <div style={{ width: '450px' }}>
        <FileUploader
          maxFiles={2}
          uploadHandler={async (files, options) => {
            const results = await dummyUploadThingConfig.uploadFiles(
              dummyUploadThingConfig.endpoint,
              {
                files,
                onUploadProgress: ({ file, progress }) => options?.onProgress?.(file, progress),
              },
            );
            results.forEach((res) => options?.onSuccess?.(files[0]!, res));
            return results;
          }}
          dropzoneTitle="UploadThing (AWS S3)"
          dropzoneSubtitle="Direct integration with UploadThing React helpers"
        />
      </div>
    );
  },
};

interface FormDemoValues {
  avatarUrl: string | null;
  attachments: File[] | null;
}

export const ReactHookFormIntegration: Story = {
  render: () => {
    const FormDemo = () => {
      const methods = useForm<FormDemoValues>({
        defaultValues: {
          avatarUrl: '',
          attachments: null,
        },
      });

      const onSubmit = (data: FormDemoValues) => {
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <FormFileUpload
              name="avatarUrl"
              label="User Avatar"
              variant="avatar"
              description="Click avatar to select image"
            />

            <FormFileUpload
              name="attachments"
              label="Attachments (Manual mode)"
              description="Files are held as File objects until form submission"
              maxFiles={3}
              showClear
            />

            <Button type="submit">Submit Form</Button>
          </form>
        </FormProvider>
      );
    };

    return <FormDemo />;
  },
};

export const PrimitivesCustomLayout: Story = {
  render: () => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
      <div style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FileUpload value={files} onValueChange={setFiles} maxFiles={5} maxSize={10 * 1024 * 1024}>
          <FileUploadDropzone>
            <Icons.CloudUpload size={24} />
            <Title level={4} size="md">
              Custom composed dropzone
            </Title>
            <Text size="sm" type="muted">
              Click or drag files here
            </Text>
          </FileUploadDropzone>

          {files.length > 0 && (
            <FileUploadList>
              {files.map((file, idx) => (
                <FileUploadItem key={idx} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemProgress variant="bottom" />
                  <FileUploadItemDelete />
                </FileUploadItem>
              ))}
            </FileUploadList>
          )}
        </FileUpload>
      </div>
    );
  },
};
