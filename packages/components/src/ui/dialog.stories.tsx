import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from './dialog';
import { Flex } from '../layout';
import { Text, Title } from '../Typography';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperNext,
  StepperPrev,
} from './stepper';
import {
  Timeline,
  TimelineItem,
  TimelineTrack,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from './timeline';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu';
import { Dropdown } from '../Dropdown';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import {
  FormInput,
  FormCheckbox,
  FormSwitch,
  FormTextarea,
  FormSelect,
  FormMultiSelect,
  FormDatePicker,
  FormRadioGroup,
  FileDropzone,
} from '../Form';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Feedback/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Standard Dialog</DialogTitle>
            <DialogDescription>
              A standard accessible W3C Dialog modal with built-in stacking context.
            </DialogDescription>
          </DialogHeader>
          <Text>This is dialog body content.</Text>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

interface FormDemoValues {
  name: string;
  role?: string;
  tags: (string | number)[];
  birthDate?: Date;
  activeStatus: boolean;
  agreeTerms: boolean;
  priority: string;
  notes: string;
  confirmReason?: string;
}

/**
 * Comprehensive integration story testing Dialog with:
 * - Stepper (multi-step workflow)
 * - Tabs
 * - All Form items (FormInput, FormSelect, FormMultiSelect, FormDatePicker, FormSwitch, FormCheckbox, FormRadioGroup, FormTextarea, FileDropzone)
 * - Timeline
 * - DropdownMenu
 * - Tooltip
 * - Nested Confirmation Modal (proving dynamic ZIndex stacking context)
 */
export const CompleteFormAndUIModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const methods = useForm<FormDemoValues>({
      defaultValues: {
        name: '',
        role: undefined,
        tags: [],
        birthDate: undefined,
        activeStatus: true,
        agreeTerms: false,
        priority: 'medium',
        notes: '',
        confirmReason: undefined,
      },
    });

    const roleOptions = [
      { label: 'Software Engineer', value: 'swe' },
      { label: 'Product Manager', value: 'pm' },
      { label: 'UI/UX Designer', value: 'designer' },
      { label: 'DevOps Engineer', value: 'devops' },
    ];

    const tagOptions = [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'GraphQL', value: 'graphql' },
      { label: 'StyleX', value: 'stylex' },
    ];

    const priorityOptions = [
      { label: 'Low Priority', value: 'low' },
      { label: 'Medium Priority', value: 'medium' },
      { label: 'High Priority', value: 'high' },
    ];

    return (
      <FormProvider {...methods}>
        <Flex vertical gap="md" align="start">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg">Open Comprehensive Modal</Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: '48rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <DialogHeader>
                <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                  <div>
                    <DialogTitle>Enterprise Form & UI Suite</DialogTitle>
                    <DialogDescription>
                      All form inputs, floating popovers, tabs, steps, timelines, and nested
                      dialogs.
                    </DialogDescription>
                  </div>

                  {/* Declarative Dropdown component inside Modal */}
                  <Dropdown
                    placement="bottomRight"
                    items={[
                      { type: 'label', label: 'Quick Actions' },
                      {
                        key: 'export',
                        label: 'Export JSON',
                        onClick: () => alert('Exporting data...'),
                      },
                      {
                        key: 'reset',
                        label: 'Reset Form',
                        onClick: () => alert('Resetting form...'),
                      },
                      { type: 'separator' },
                      {
                        key: 'delete',
                        label: 'Delete Project',
                        danger: true,
                        onClick: () => setConfirmOpen(true),
                      },
                    ]}
                  >
                    <Button variant="outline" size="sm">
                      Options ▾
                    </Button>
                  </Dropdown>
                </Flex>
              </DialogHeader>

              {/* Stepper Component */}
              <Stepper defaultValue="form" style={{ marginTop: '0.5rem' }}>
                <StepperList>
                  <StepperItem value="form">
                    <StepperTrigger>
                      <StepperIndicator>1</StepperIndicator>
                      <div>
                        <StepperTitle>Form Controls</StepperTitle>
                        <StepperDescription>Inputs & Dropdowns</StepperDescription>
                      </div>
                    </StepperTrigger>
                    <StepperSeparator />
                  </StepperItem>

                  <StepperItem value="activity">
                    <StepperTrigger>
                      <StepperIndicator>2</StepperIndicator>
                      <div>
                        <StepperTitle>Activity & UI</StepperTitle>
                        <StepperDescription>Timeline & Files</StepperDescription>
                      </div>
                    </StepperTrigger>
                  </StepperItem>
                </StepperList>

                {/* Step 1: Form & Controls */}
                <StepperContent value="form">
                  <Tabs defaultValue="basic" style={{ marginTop: '1rem' }}>
                    <TabsList>
                      <TabsTrigger value="basic">Basic Information</TabsTrigger>
                      <TabsTrigger value="advanced">Preferences & Dates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                      <Flex vertical gap="md" style={{ marginTop: '1rem' }}>
                        <FormInput
                          name="name"
                          label="Full Name"
                          placeholder="Enter full name..."
                          required
                          tooltip="Your legal identification name"
                        />

                        {/* Popover FormSelect inside Modal */}
                        <FormSelect
                          name="role"
                          label="Job Role (FormSelect Popover)"
                          placeholder="Select a role..."
                          options={roleOptions}
                          required
                          width="full"
                          tooltip="Select primary technical domain"
                        />

                        {/* Popover FormMultiSelect inside Modal */}
                        <FormMultiSelect
                          name="tags"
                          label="Skills & Expertise (FormMultiSelect Popover)"
                          placeholder="Choose multiple skills..."
                          options={tagOptions}
                          width="full"
                        />

                        <FormRadioGroup
                          name="priority"
                          label="Project Priority"
                          options={priorityOptions}
                        />
                      </Flex>
                    </TabsContent>

                    <TabsContent value="advanced">
                      <Flex vertical gap="md" style={{ marginTop: '1rem' }}>
                        {/* Popover FormDatePicker inside Modal */}
                        <FormDatePicker
                          name="birthDate"
                          label="Birth Date (FormDatePicker Popover)"
                          placeholder="Pick a birth date..."
                          width="full"
                        />

                        <FormTextarea
                          name="notes"
                          label="Additional Notes"
                          placeholder="Type any additional requirements..."
                          rows={3}
                        />

                        <Flex gap="xl" align="center" style={{ marginTop: '0.5rem' }}>
                          <FormSwitch name="activeStatus" label="Active Account Status" />

                          <FormCheckbox name="agreeTerms" label="I agree to terms & conditions" />
                        </Flex>
                      </Flex>
                    </TabsContent>
                  </Tabs>

                  <Flex justify="flex-end" style={{ marginTop: '1.5rem' }}>
                    <StepperNext>Next to Activity ➔</StepperNext>
                  </Flex>
                </StepperContent>

                {/* Step 2: Activity Timeline & File Upload */}
                <StepperContent value="activity">
                  <Flex vertical gap="lg" style={{ marginTop: '1rem' }}>
                    <div>
                      <Title level={4} style={{ marginBottom: '0.75rem' }}>
                        Project Activity Timeline
                      </Title>
                      <Timeline>
                        <TimelineItem status="completed">
                          <TimelineTrack>
                            <TimelineDot status="completed" />
                            <TimelineConnector status="completed" />
                          </TimelineTrack>
                          <TimelineContent>
                            <TimelineHeader>
                              <TimelineTitle>Project Kickoff</TimelineTitle>
                              <TimelineTime>Yesterday</TimelineTime>
                            </TimelineHeader>
                            <TimelineDescription>
                              Architecture design & zIndex stacking specification initialized.
                            </TimelineDescription>
                          </TimelineContent>
                        </TimelineItem>

                        <TimelineItem status="active">
                          <TimelineTrack>
                            <TimelineDot status="active" />
                            <TimelineConnector status="pending" />
                          </TimelineTrack>
                          <TimelineContent>
                            <TimelineHeader>
                              <TimelineTitle>Component Stacking Validation</TimelineTitle>
                              <TimelineTime>Today</TimelineTime>
                            </TimelineHeader>
                            <TimelineDescription>
                              Validating FormSelect and DatePicker popovers inside Modal.
                            </TimelineDescription>
                          </TimelineContent>
                        </TimelineItem>

                        <TimelineItem status="pending">
                          <TimelineTrack>
                            <TimelineDot status="pending" />
                          </TimelineTrack>
                          <TimelineContent>
                            <TimelineHeader>
                              <TimelineTitle>Production Release</TimelineTitle>
                              <TimelineTime>Tomorrow</TimelineTime>
                            </TimelineHeader>
                            <TimelineDescription>
                              Deploying verified package with 100% W3C accessibility compliance.
                            </TimelineDescription>
                          </TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    </div>

                    <div>
                      <Title level={4} style={{ marginBottom: '0.5rem' }}>
                        Attachment Upload
                      </Title>
                      <FileDropzone
                        onFilesSelected={(files) => console.log('Selected files:', files)}
                        maxFiles={3}
                      />
                    </div>

                    <Flex justify="space-between" align="center" style={{ marginTop: '1rem' }}>
                      <StepperPrev>⬅ Back to Form</StepperPrev>
                      <Flex gap="sm">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                              Delete With Nested Modal
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Triggers a second modal layered on top of this modal
                          </TooltipContent>
                        </Tooltip>
                        <Button onClick={() => setOpen(false)}>Save & Close</Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </StepperContent>
              </Stepper>

              <DialogFooter style={{ marginTop: '1.5rem' }}>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Nested Confirmation Dialog (Proves Level 2 ZIndex Context Stack) */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent style={{ maxWidth: '28rem' }}>
              <DialogHeader>
                <DialogTitle>Confirm Action (Nested Dialog)</DialogTitle>
                <DialogDescription>
                  This modal is rendered on top of the parent modal. Even here, popovers and selects
                  stack correctly!
                </DialogDescription>
              </DialogHeader>

              <Flex vertical gap="md" style={{ padding: '0.5rem 0' }}>
                <Text>
                  Notice how the backdrop dims the previous modal and this modal floats above it.
                </Text>
                <FormSelect
                  name="confirmReason"
                  label="Confirmation Reason (Popover inside Nested Modal)"
                  placeholder="Choose reason..."
                  options={[
                    { label: 'Completed Milestone', value: 'done' },
                    { label: 'Deprecated Requirement', value: 'deprecated' },
                    { label: 'Testing Stacking Hierarchy', value: 'test' },
                  ]}
                  width="full"
                />
              </Flex>

              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setConfirmOpen(false);
                    setOpen(false);
                  }}
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Flex>
      </FormProvider>
    );
  },
};
