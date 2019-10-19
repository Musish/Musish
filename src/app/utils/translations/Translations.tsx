import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';

import Brazilian from './languages/BrazilianPortuguese.json';
import english from './languages/English.json';
import french from './languages/French.json';
import greek from './languages/Greek.json';
import hungarian from './languages/Hungarian.json';
import italian from './languages/Italian.json';
import korean from './languages/Korean.json';
import polish from './languages/Polish.json';
import russian from './languages/Russian.json';
import SChinese from './languages/SChinese.json';
import turkish from './languages/Turkish.json';

const localization = new LocalizedStrings({
  en: english,
  gb: english,
  pl: polish,
  gr: greek,
  fr: french,
  it: italian,
  tr: turkish,
  ru: russian,
  br: Brazilian,
  kr: korean,
  hu: hungarian,
  'zh-CN': SChinese,
});

// This sets the default storefront language.
localization.setLanguage('en');

type SupportedKeys = { [s in keyof typeof english]: string } & LocalizedStringsMethods;

export default localization as SupportedKeys;
