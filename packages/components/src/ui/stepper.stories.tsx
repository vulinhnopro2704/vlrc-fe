import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperText,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperNext,
  StepperPrev,
} from './stepper';
import { Flex } from './flex';
import { Card } from './card';

const meta: Meta<typeof Stepper> = {
  title: 'UI/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    linear: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => {
    return (
      <Stepper defaultValue="account" style={{ maxWidth: 700 }}>
        <StepperList>
          <StepperItem value="account">
            <StepperTrigger>
              <StepperIndicator />
              <StepperText>
                <StepperTitle>Account</StepperTitle>
                <StepperDescription>Enter credentials</StepperDescription>
              </StepperText>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>

          <StepperItem value="profile">
            <StepperTrigger>
              <StepperIndicator />
              <StepperText>
                <StepperTitle>Profile</StepperTitle>
                <StepperDescription>Personal info</StepperDescription>
              </StepperText>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>

          <StepperItem value="confirmation">
            <StepperTrigger>
              <StepperIndicator />
              <StepperText>
                <StepperTitle>Confirm</StepperTitle>
                <StepperDescription>Review summary</StepperDescription>
              </StepperText>
            </StepperTrigger>
          </StepperItem>
        </StepperList>

        <Card style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <StepperContent value="account">
            <h3>Step 1: Account Setup</h3>
            <p>Please enter your email and password to proceed.</p>
          </StepperContent>

          <StepperContent value="profile">
            <h3>Step 2: Personal Profile</h3>
            <p>Fill out your display name, department, and role.</p>
          </StepperContent>

          <StepperContent value="confirmation">
            <h3>Step 3: Review & Submit</h3>
            <p>All information is validated. Click finish to create account.</p>
          </StepperContent>

          <Flex justify="between" style={{ marginTop: '1.5rem' }}>
            <StepperPrev />
            <StepperNext />
          </Flex>
        </Card>
      </Stepper>
    );
  },
};

export const Vertical: Story = {
  render: () => (
    <Stepper orientation="vertical" defaultValue="step-1" style={{ maxWidth: 400 }}>
      <StepperList>
        <StepperItem value="step-1">
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Basic Configuration</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value="step-2">
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Access Control & RBAC</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value="step-3">
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Deploy & Finish</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </StepperList>
    </Stepper>
  ),
};
