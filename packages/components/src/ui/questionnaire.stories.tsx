import type { Meta, StoryObj } from '@storybook/react';
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireContent,
  QuestionnaireProgress,
  QuestionnaireActions,
  QuestionnairePrevious,
  QuestionnaireNext,
  QuestionnaireSkip,
  useQuestionnaire,
} from './questionnaire';
import { Box, VStack, HStack } from '../layout';
import { Text } from '../Typography';
import { Button } from './button';

const meta: Meta<typeof Questionnaire> = {
  title: 'Forms/Questionnaire',
  component: Questionnaire,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Questionnaire>;

function RadioChoiceGroup({
  name,
  options,
}: {
  name: string;
  options: Array<{ label: string; value: string }>;
}) {
  const { getValue, setValue } = useQuestionnaire();
  const currentVal = getValue(name);

  return (
    <VStack gap="xs">
      {options.map((opt) => (
        <HStack
          key={opt.value}
          gap="sm"
          style={{
            padding: '0.625rem 0.875rem',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: currentVal === opt.value ? 'var(--secondary)' : 'transparent',
          }}
          onClick={() => setValue(name, opt.value)}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={currentVal === opt.value}
            onChange={() => setValue(name, opt.value)}
          />
          <Text size="sm">{opt.label}</Text>
        </HStack>
      ))}
    </VStack>
  );
}

export const Default: Story = {
  render: () => {
    return (
      <Box
        style={{
          width: 450,
          padding: '1rem',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}
      >
        <Questionnaire
          onSubmit={(vals) => {
            alert(`Submitted values:\n${JSON.stringify(vals, null, 2)}`);
          }}
        >
          <QuestionnaireProgress variant="segmented" />

          <QuestionnaireItem
            name="role"
            title="What describes your primary role?"
            description="Help us tailor your developer platform experience."
            required
          >
            <QuestionnaireContent>
              <RadioChoiceGroup
                name="role"
                options={[
                  { label: 'Frontend Engineer', value: 'frontend' },
                  { label: 'Fullstack / Backend Engineer', value: 'fullstack' },
                  { label: 'Design System Architect', value: 'architect' },
                  { label: 'Product Manager', value: 'pm' },
                ]}
              />
            </QuestionnaireContent>
          </QuestionnaireItem>

          <QuestionnaireItem
            name="styling"
            title="Which styling paradigm do you prefer?"
            description="We support Meta StyleX and zero runtime tokens."
          >
            <QuestionnaireContent>
              <RadioChoiceGroup
                name="styling"
                options={[
                  { label: 'Meta StyleX (Statically evaluable CSS)', value: 'stylex' },
                  { label: 'Tailwind CSS', value: 'tailwind' },
                  { label: 'CSS Modules', value: 'modules' },
                ]}
              />
            </QuestionnaireContent>
          </QuestionnaireItem>

          <QuestionnaireItem
            name="satisfaction"
            title="Overall experience rating?"
            description="Optional feedback for continuous improvement."
          >
            <QuestionnaireContent>
              <RadioChoiceGroup
                name="satisfaction"
                options={[
                  { label: '⭐️⭐️⭐️⭐️⭐️ Outstanding', value: '5' },
                  { label: '⭐️⭐️⭐️⭐️ Good', value: '4' },
                  { label: '⭐️⭐️⭐️ Neutral', value: '3' },
                ]}
              />
            </QuestionnaireContent>
          </QuestionnaireItem>

          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireSkip />
            <QuestionnaireNext completeLabel="Complete Survey" />
          </QuestionnaireActions>
        </Questionnaire>
      </Box>
    );
  },
};

export const ProgressBarVariant: Story = {
  render: () => (
    <Box
      style={{
        width: 450,
        padding: '1rem',
        border: '1px solid var(--border)',
        borderRadius: '8px',
      }}
    >
      <Questionnaire>
        <QuestionnaireProgress variant="bar" />
        <QuestionnaireItem name="step1" title="First question">
          <QuestionnaireContent>
            <Text size="sm">Answer input for step 1</Text>
          </QuestionnaireContent>
        </QuestionnaireItem>
        <QuestionnaireItem name="step2" title="Second question">
          <QuestionnaireContent>
            <Text size="sm">Answer input for step 2</Text>
          </QuestionnaireContent>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
        </QuestionnaireActions>
      </Questionnaire>
    </Box>
  ),
};
