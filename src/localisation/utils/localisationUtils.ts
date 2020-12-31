import { Constants } from '../../constants';
import { equalsAnyCase } from '../../utils/checkUtils';
import { Locale, Locales } from '../types/Locale';

export function getLocale(localeStrs: string[]): Locale {

  // Handle case when Accept-Language header is missing/blank
  if (!localeStrs?.length || localeStrs[0] === '*') {
    return Constants.DEFAULTS.LOCALE;
  }

  let prevLanguageCode: string | undefined;
  for (const localeStr of localeStrs) {
    let locale: Locale | undefined;
    const languageCode: string = localeStr.split('-')[0].toLowerCase();
    // If locale's language has changed then search for the previous language code before moving to the new locale
    if (prevLanguageCode && prevLanguageCode !== languageCode) {
      locale = Locales.find((validLocale: Locale) => equalsAnyCase(validLocale, prevLanguageCode));
    }
    if (!locale) {
      // Search for current locale
      locale = Locales.find((validLocale: Locale) => equalsAnyCase(validLocale, localeStr));
    }
    if (locale) {
      return locale;
    }
    // Save current locale's language code for the next iteration
    // Do this only if locale is in long format, e.g. xx-XX
    prevLanguageCode = localeStr.length !== languageCode.length ? languageCode : undefined;
  }

  return Constants.DEFAULTS.LOCALE;
}
