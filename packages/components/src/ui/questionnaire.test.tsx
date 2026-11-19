import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireDescription,
  QuestionnaireContent,
  QuestionnaireProgress,
  QuestionnaireActions,
  QuestionnairePrevious,
  QuestionnaireNext,
  QuestionnaireSkip,
} from './questionnaire';
import type { QuestionnaireProps, QuestionnaireProgressVariant } from './questionnaire';

// Test constants
const STEP_1_NAME = 'role';
const STEP_1_TITLE = 'What is your primary role?';
const STEP_1_DESC = 'Select the option that best describes your position.';

const STEP_2_NAME = 'experience';
const STEP_2_TITLE = 'Years of experience';
const STEP_2_DESC = 'Optional feedback on your background.';

const STEP_3_NAME = 'feedback';
const STEP_3_TITLE = 'Any suggestions for improvement?';

const createDefaultProps = (overrides?: Partial<QuestionnaireProps>): QuestionnaireProps => ({
  defaultStep: 0,
  defaultValues: {},
  ...overrides,
});

describe('Questionnaire', () => {
  describe('UI', () => {
    it('should match snapshot in default step 1 state', () => {
      const { asFragment } = render(
        <Questionnaire {...createDefaultProps()}>
          <QuestionnaireProgress variant="segmented" />
          <QuestionnaireItem
            name={STEP_1_NAME}
            title={STEP_1_TITLE}
            description={STEP_1_DESC}
            required
          >
            <QuestionnaireContent>
              <input data-testid="input-role" defaultValue="engineer" />
            </QuestionnaireContent>
          </QuestionnaireItem>
          <QuestionnaireItem name={STEP_2_NAME} title={STEP_2_TITLE} description={STEP_2_DESC}>
            <QuestionnaireContent>
              <input data-testid="input-exp" defaultValue="5" />
            </QuestionnaireContent>
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireSkip />
            <QuestionnaireNext />
          </QuestionnaireActions>
        </Questionnaire>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it.each([
      ['segmented' as QuestionnaireProgressVariant],
      ['bar' as QuestionnaireProgressVariant],
    ])('should match snapshot for progress %s variant', (variant) => {
      const { asFragment } = render(
        <Questionnaire {...createDefaultProps()}>
          <QuestionnaireProgress variant={variant} />
          <QuestionnaireItem name={STEP_1_NAME} title={STEP_1_TITLE} />
        </Questionnaire>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should transition between steps when clicking next and back', async () => {
      const onStepChange = vi.fn();
      render(
        <Questionnaire onStepChange={onStepChange}>
          <QuestionnaireProgress />
          <QuestionnaireItem name={STEP_1_NAME} title={STEP_1_TITLE}>
            <QuestionnaireContent>
              <input data-testid="input-role" defaultValue="engineer" />
            </QuestionnaireContent>
          </QuestionnaireItem>
          <QuestionnaireItem name={STEP_2_NAME} title={STEP_2_TITLE}>
            <QuestionnaireContent>
              <input data-testid="input-exp" defaultValue="3" />
            </QuestionnaireContent>
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext />
          </QuestionnaireActions>
        </Questionnaire>,
      );

      // In step 1: previous button should be disabled
      const prevBtn = screen.getByRole('button', { name: /back/i });
      expect(prevBtn).toBeDisabled();

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeEnabled();

      // Advance to step 2
      await act(async () => {
        fireEvent.click(nextBtn);
      });

      expect(onStepChange).toHaveBeenCalledWith(1, STEP_2_NAME);
      expect(prevBtn).not.toBeDisabled();

      // Go back to step 1
      await act(async () => {
        fireEvent.click(prevBtn);
      });

      expect(onStepChange).toHaveBeenCalledWith(0, STEP_1_NAME);
    });

    it('should skip non-required steps and hide skip button for required steps', async () => {
      const onStepChange = vi.fn();
      render(
        <Questionnaire
          defaultStep={0}
          onStepChange={onStepChange}
          defaultValues={{ [STEP_1_NAME]: 'Engineer' }}
        >
          <QuestionnaireItem name={STEP_1_NAME} title={STEP_1_TITLE} required>
            <QuestionnaireContent>
              <span>Required step 1</span>
            </QuestionnaireContent>
          </QuestionnaireItem>
          <QuestionnaireItem name={STEP_2_NAME} title={STEP_2_TITLE}>
            <QuestionnaireContent>
              <span>Optional step 2</span>
            </QuestionnaireContent>
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnaireSkip />
            <QuestionnaireNext />
          </QuestionnaireActions>
        </Questionnaire>,
      );

      // On required step 1, skip button is not rendered
      expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument();

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeEnabled();
      await act(async () => {
        fireEvent.click(nextBtn);
      });

      // On optional step 2, skip button appears
      const skipBtn = screen.getByRole('button', { name: /skip/i });
      expect(skipBtn).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(skipBtn);
      });

      expect(onStepChange).toHaveBeenCalledWith(1, STEP_2_NAME);
    });

    it('should submit form on the last step', async () => {
      const onSubmit = vi.fn();
      render(
        <Questionnaire
          defaultStep={0}
          onSubmit={onSubmit}
          defaultValues={{ [STEP_1_NAME]: 'Engineer' }}
        >
          <QuestionnaireItem name={STEP_1_NAME} title={STEP_1_TITLE}>
            <QuestionnaireContent>
              <span>Single question</span>
            </QuestionnaireContent>
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnaireNext completeLabel="Finish Questionnaire" />
          </QuestionnaireActions>
        </Questionnaire>,
      );

      const submitBtn = screen.getByRole('button', { name: /finish questionnaire/i });
      expect(submitBtn).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.mock.calls[0][0]).toEqual({ [STEP_1_NAME]: 'Engineer' });
    });
  });
});
