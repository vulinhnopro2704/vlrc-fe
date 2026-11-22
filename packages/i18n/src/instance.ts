import i18n, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

export interface InitI18nOptions {
  /** Language -> namespace -> key/value resources, e.g. `{ en: { projecthub: {...}, translation: {...} } }` */
  resources: Record<string, Record<string, Record<string, any>>>;
  /** Initial language (passed through to i18next as `lng`). */
  lng?: string;
  /** Fallback language (passed through to i18next as `fallbackLng`). */
  fallbackLng?: string;
  /** Default namespace (passed through to i18next as `defaultNS`). */
  defaultNS?: string | string[];
  /** Alias for `lng`. */
  defaultLanguage?: string;
  /** Alias for `fallbackLng`. */
  fallbackLanguage?: string;
}

export const createI18nInstance = ({
  resources,
  lng,
  fallbackLng,
  defaultNS,
  defaultLanguage,
  fallbackLanguage,
}: InitI18nOptions): I18nInstance => {
  const instance = i18n.createInstance();

  instance.use(initReactI18next).init({
    resources,
    lng: lng ?? defaultLanguage ?? 'en',
    fallbackLng: fallbackLng ?? fallbackLanguage ?? 'en',
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
  });

  return instance;
};

export default i18n;
