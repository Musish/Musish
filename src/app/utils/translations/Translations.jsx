import LocalizedStrings from 'react-localization';
import english from './languages/English';
import polish from './languages/Polish';
import greek from './languages/Greek';
import french from './languages/French';
import italian from './languages/Italian';
import turkish from './languages/Turkish';

const localization = new LocalizedStrings({
  en: english,
  gb: english,
  pl: polish,
  gr: greek,
  fr: french,
  it: italian,
  tr: turkish,
});

// This sets the defualt storefront language.
localization.setLanguage('en');

export default localization;
