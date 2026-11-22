import { createI18nInstance } from './instance';

export * from './instance';
export { useTranslation, Trans } from 'react-i18next';
export type { i18n as I18nInstance } from 'i18next';
export default createI18nInstance;
