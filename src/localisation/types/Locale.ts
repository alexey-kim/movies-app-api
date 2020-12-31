import { Constants } from '../../constants';

export const Locales = [
  Constants.DEFAULTS.LOCALE,
  'en-CA',
  'en-GB'
] as const;

export type Locale = typeof Locales[number];
