import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

const STEP_1 = 'step-1';
const STEP_2 = 'step-2';
const STEP_3 = 'step-3';
const TITLE_1 = 'Account';
const TITLE_2 = 'Profile';
const TITLE_3 = 'Review';
const CONTENT_1 = 'Account Details Form';
const CONTENT_2 = 'Profile Information Form';
const CONTENT_3 = 'Review & Confirmation';

describe('Stepper', () => {
  describe('UI', () => {
    it('should match snapshot in default horizontal state', () => {
      const { asFragment } = render(
        <Stepper defaultValue={STEP_1}>
          <StepperList>
            <StepperItem value={STEP_1}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{TITLE_1}</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem value={STEP_2}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{TITLE_2}</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem value={STEP_3}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{TITLE_3}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperList>

          <StepperContent value={STEP_1}>{CONTENT_1}</StepperContent>
          <StepperContent value={STEP_2}>{CONTENT_2}</StepperContent>
          <StepperContent value={STEP_3}>{CONTENT_3}</StepperContent>
        </Stepper>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot in vertical orientation', () => {
      const { asFragment } = render(
        <Stepper orientation="vertical" defaultValue={STEP_1}>
          <StepperList>
            <StepperItem value={STEP_1}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{TITLE_1}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
          <StepperContent value={STEP_1}>{CONTENT_1}</StepperContent>
        </Stepper>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Behavior', () => {
    it('should navigate to next and previous steps via StepperNext and StepperPrev', async () => {
      const onValueChange = vi.fn();

      render(
        <Stepper defaultValue={STEP_1} onValueChange={onValueChange}>
          <StepperList>
            <StepperItem value={STEP_1}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{TITLE_1}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
            <StepperItem value={STEP_2}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{TITLE_2}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperList>

          <StepperContent value={STEP_1}>{CONTENT_1}</StepperContent>
          <StepperContent value={STEP_2}>{CONTENT_2}</StepperContent>

          <StepperPrev data-testid="prev-btn" />
          <StepperNext data-testid="next-btn" />
        </Stepper>,
      );

      const prevBtn = screen.getByTestId('prev-btn');
      const nextBtn = screen.getByTestId('next-btn');

      expect(prevBtn).toBeDisabled();
      expect(nextBtn).toBeEnabled();
      expect(screen.getByText(CONTENT_1)).toBeInTheDocument();

      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith(STEP_2);
        expect(screen.getByText(CONTENT_2)).toBeInTheDocument();
        expect(screen.queryByText(CONTENT_1)).not.toBeInTheDocument();
      });

      expect(nextBtn).toBeDisabled();
      expect(prevBtn).toBeEnabled();

      fireEvent.click(prevBtn);

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith(STEP_1);
        expect(screen.getByText(CONTENT_1)).toBeInTheDocument();
      });
    });

    it('should block navigation if onValidateStep returns false', async () => {
      const onValidateStep = vi.fn().mockResolvedValue(false);

      render(
        <Stepper defaultValue={STEP_1} onValidateStep={onValidateStep}>
          <StepperList>
            <StepperItem value={STEP_1}>
              <StepperTrigger>
                <StepperTitle>{TITLE_1}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
            <StepperItem value={STEP_2}>
              <StepperTrigger>
                <StepperTitle>{TITLE_2}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperList>

          <StepperContent value={STEP_1}>{CONTENT_1}</StepperContent>
          <StepperContent value={STEP_2}>{CONTENT_2}</StepperContent>

          <StepperNext data-testid="next-btn" />
        </Stepper>,
      );

      fireEvent.click(screen.getByTestId('next-btn'));

      await waitFor(() => {
        expect(onValidateStep).toHaveBeenCalledWith(STEP_1, STEP_2);
        expect(screen.getByText(CONTENT_1)).toBeInTheDocument();
        expect(screen.queryByText(CONTENT_2)).not.toBeInTheDocument();
      });
    });

    it('should support arrow key keyboard navigation across triggers', async () => {
      const onValueChange = vi.fn();

      render(
        <Stepper defaultValue={STEP_1} linear={false} onValueChange={onValueChange}>
          <StepperList>
            <StepperItem value={STEP_1}>
              <StepperTrigger data-testid="trigger-1">
                <StepperTitle>{TITLE_1}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
            <StepperItem value={STEP_2}>
              <StepperTrigger data-testid="trigger-2">
                <StepperTitle>{TITLE_2}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
        </Stepper>,
      );

      const trigger1 = screen.getByTestId('trigger-1');
      fireEvent.keyDown(trigger1, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith(STEP_2);
      });
    });

    it('should not cross-focus when multiple Steppers exist on the same page with identical step keys', async () => {
      render(
        <div>
          <Stepper defaultValue="step-1" linear={false}>
            <StepperList data-testid="stepper-1-list">
              <StepperItem value="step-1">
                <StepperTrigger data-testid="s1-trigger-1">
                  <StepperTitle>S1 Step 1</StepperTitle>
                </StepperTrigger>
              </StepperItem>
              <StepperItem value="step-2">
                <StepperTrigger data-testid="s1-trigger-2">
                  <StepperTitle>S1 Step 2</StepperTitle>
                </StepperTrigger>
              </StepperItem>
            </StepperList>
            <StepperContent value="step-1">S1 Content 1</StepperContent>
            <StepperContent value="step-2">S1 Content 2</StepperContent>
          </Stepper>

          <Stepper defaultValue="step-1" linear={false}>
            <StepperList data-testid="stepper-2-list">
              <StepperItem value="step-1">
                <StepperTrigger data-testid="s2-trigger-1">
                  <StepperTitle>S2 Step 1</StepperTitle>
                </StepperTrigger>
              </StepperItem>
              <StepperItem value="step-2">
                <StepperTrigger data-testid="s2-trigger-2">
                  <StepperTitle>S2 Step 2</StepperTitle>
                </StepperTrigger>
              </StepperItem>
            </StepperList>
            <StepperContent value="step-1">S2 Content 1</StepperContent>
            <StepperContent value="step-2">S2 Content 2</StepperContent>
          </Stepper>
        </div>,
      );

      const s2Trigger1 = screen.getByTestId('s2-trigger-1');
      const s2Trigger2 = screen.getByTestId('s2-trigger-2');
      const s1Trigger2 = screen.getByTestId('s1-trigger-2');

      s2Trigger1.focus();
      expect(document.activeElement).toBe(s2Trigger1);

      fireEvent.keyDown(s2Trigger1, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(document.activeElement).toBe(s2Trigger2);
        expect(document.activeElement).not.toBe(s1Trigger2);
      });
    });
  });
});
