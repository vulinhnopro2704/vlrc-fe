import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../theme/tokens.stylex';
import { Button } from '../../ui/button';

const styles = stylex.create({
  controls: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '0.25rem',
  },
  btnUp: {
    paddingInline: '0.5rem',
    height: '1.125rem',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderLeftWidth: 0,
    borderBottomWidth: '0.5px',
    borderColor: colors.input,
  },
  btnDown: {
    paddingInline: '0.5rem',
    height: '1.125rem',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderLeftWidth: 0,
    borderTopWidth: '0.5px',
    borderColor: colors.input,
  },
});

interface StepperControlsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  disableIncrement: boolean;
  disableDecrement: boolean;
}

export function StepperControls({
  onIncrement,
  onDecrement,
  disableIncrement,
  disableDecrement,
}: StepperControlsProps) {
  const { t } = useTranslation();

  return (
    <div {...stylex.props(styles.controls)}>
      <Button
        aria-label={t('form_increase_value')}
        sx={styles.btnUp}
        variant="outline"
        onClick={onIncrement}
        disabled={disableIncrement}
        type="button"
      >
        <ChevronUp size={15} />
      </Button>
      <Button
        aria-label={t('form_decrease_value')}
        sx={styles.btnDown}
        variant="outline"
        onClick={onDecrement}
        disabled={disableDecrement}
        type="button"
      >
        <ChevronDown size={15} />
      </Button>
    </div>
  );
}
