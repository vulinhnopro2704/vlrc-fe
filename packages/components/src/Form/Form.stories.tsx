import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { FormCheckbox, FormInput, FormTextarea } from './Form';
import FormRadioGroup from './FormRadioGroup';
import FormSelect from './FormSelect';
import { FormFileUpload, FormFileUploader } from './FormFileUpload';
import { Title, Text } from '../Typography';
import { createApiUploadHandler } from '../ui/file-upload';

interface FormValues {
  avatar: string | null;
  username: string;
  email: string;
  role: string;
  bio: string;
  documents: File[] | null;
  notificationPreference: string;
  terms: boolean;
}

const meta = {
  title: 'Forms/FormControls',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Standardized form field components wired directly with React Hook Form. Standardizes label placement, required indicators, inline error messaging, and accessibility.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function FullFormWorkflowDemo() {
  const methods = useForm<FormValues>({
    defaultValues: {
      avatar: null,
      username: '',
      email: '',
      role: 'developer',
      bio: '',
      documents: null,
      notificationPreference: 'email',
      terms: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    alert(`Form Submitted:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{
          width: 480,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          padding: '1.5rem',
          border: '1px solid var(--border)',
          borderRadius: '0.75rem',
          backgroundColor: 'var(--card)',
        }}
      >
        <Title level={3} size="lg">
          Create Account
        </Title>

        <FormFileUpload
          name="avatar"
          control={methods.control}
          label="Profile Photo"
          variant="avatar"
          description="Click to upload your profile avatar"
        />

        <FormInput
          name="username"
          control={methods.control}
          label="Username"
          placeholder="e.g. janesmith"
          rules={{ required: 'Username is required' }}
          description="Your unique public handle on the platform."
        />

        <FormInput
          name="email"
          control={methods.control}
          label="Email Address"
          placeholder="jane@example.com"
          htmlType="email"
          rules={{ required: 'Email is required' }}
        />

        <FormSelect
          name="role"
          control={methods.control}
          label="Role"
          placeholder="Select your role"
          options={[
            { value: 'developer', label: 'Developer' },
            { value: 'designer', label: 'Designer' },
            { value: 'manager', label: 'Product Manager' },
          ]}
        />

        <FormFileUpload
          name="documents"
          control={methods.control}
          label="Certificates & Resume"
          description="Upload up to 3 PDF or image files (max 5 MB each)"
          maxFiles={3}
          maxSize={5 * 1024 * 1024}
          accept="image/*,.pdf"
          showClear
        />

        <FormRadioGroup
          name="notificationPreference"
          control={methods.control}
          label="Notifications"
          options={[
            { value: 'email', label: 'Email digest' },
            { value: 'push', label: 'Push notifications' },
            { value: 'none', label: 'Do not notify' },
          ]}
        />

        <FormTextarea
          name="bio"
          control={methods.control}
          label="Short Bio"
          description="Tell us a little about your experience..."
        />

        <FormCheckbox
          name="terms"
          control={methods.control}
          label="I accept the Terms of Service and Privacy Policy"
          rules={{ required: 'You must accept the terms' }}
        />

        <Button type="submit">Submit Application</Button>
      </form>
    </FormProvider>
  );
}

export const FullFormWorkflow: Story = {
  render: () => <FullFormWorkflowDemo />,
};

interface AvatarFormValues {
  avatarUrl: string | null;
  fullName: string;
}

export const AvatarProfileForm: Story = {
  render: () => {
    const methods = useForm<AvatarFormValues>({
      defaultValues: {
        avatarUrl: null,
        fullName: 'Jane Doe',
      },
    });

    const onSubmit = (data: AvatarFormValues) => {
      alert(JSON.stringify(data, null, 2));
    };

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--card)',
            alignItems: 'center',
          }}
        >
          <Title level={4} size="md">
            Profile Settings
          </Title>
          <Text size="sm" type="muted">
            Manage your personal public avatar
          </Text>

          <FormFileUpload
            name="avatarUrl"
            control={methods.control}
            variant="avatar"
            rules={{ required: 'Profile photo is required' }}
          />

          <div style={{ width: '100%' }}>
            <FormInput
              name="fullName"
              control={methods.control}
              label="Full Name"
              rules={{ required: 'Full name is required' }}
            />
          </div>

          <Button type="submit" style={{ width: '100%' }}>
            Save Profile
          </Button>
        </form>
      </FormProvider>
    );
  },
};

interface CompactFormValues {
  attachment: File | null;
}

export const CompactFileControl: Story = {
  render: () => {
    const methods = useForm<CompactFormValues>({
      defaultValues: {
        attachment: null,
      },
    });

    return (
      <FormProvider {...methods}>
        <div style={{ width: 440 }}>
          <FormFileUploader
            name="attachment"
            control={methods.control}
            label="Quick Attachment"
            variant="compact"
            description="Compact row layout with inline browse button"
            showClear
          />
        </div>
      </FormProvider>
    );
  },
};

interface ApiAutoUploadFormValues {
  uploadedUrl: string | null;
}

export const AutoUploadWithApiStorage: Story = {
  render: () => {
    const methods = useForm<ApiAutoUploadFormValues>({
      defaultValues: {
        uploadedUrl: null,
      },
    });

    // Simulated custom API upload adapter
    const simulatedApiHandler = createApiUploadHandler({
      endpoint: '/api/v1/files/upload',
      fieldName: 'file',
      responseParser: (_res: unknown, file: File) => ({
        key: file.name,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `https://storage.vlrc.vn/uploads/${file.name}`,
      }),
    });

    const onSubmit = (data: ApiAutoUploadFormValues) => {
      alert(`Uploaded Remote URL: ${data.uploadedUrl}`);
    };

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ width: 440, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <Title level={4} size="md">
            Auto-upload with Custom Backend API
          </Title>
          <Text size="sm" type="muted">
            Files are immediately uploaded to the storage API and the remote URL is stored in form
            state.
          </Text>

          <FormFileUpload
            name="uploadedUrl"
            control={methods.control}
            label="Cloud Document"
            autoUpload
            uploadHandler={simulatedApiHandler}
            description="Uses real-time progress via XMLHttpRequest"
            showClear
          />

          <Button type="submit">Submit Form</Button>
        </form>
      </FormProvider>
    );
  },
};
