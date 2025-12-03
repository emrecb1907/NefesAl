import { useMemo } from 'react';
import { useAppStore } from '../state/store';
import trTranslations from '../locales/tr.json';
import enTranslations from '../locales/en.json';

type TranslationKey = 
  | keyof typeof trTranslations
  | `${keyof typeof trTranslations}.${string}`
  | `${keyof typeof trTranslations}.${string}.${string}`;

const translations = {
  tr: trTranslations,
  en: enTranslations,
};

export const useTranslation = () => {
  const language = useAppStore((state) => state.language);

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};

