import * as Localization from 'expo-localization';
import { useState, useEffect } from 'react';

export const useLocalization = () => {
  const [locale, setLocale] = useState(Localization.locale);
  const [region, setRegion] = useState(Localization.region);

  useEffect(() => {
    const updateLocale = async () => {
      const locales = await Localization.getLocales();
      if (locales.length > 0) {
        setLocale(locales[0].languageCode || Localization.locale);
        setRegion(locales[0].regionCode || Localization.region);
      }
    };

    updateLocale();
  }, []);

  return {
    locale,
    region,
    isRTL: Localization.isRTL,
    currency: Localization.currency,
    decimalSeparator: Localization.decimalSeparator,
    digitGroupingSeparator: Localization.digitGroupingSeparator,
  };
};

