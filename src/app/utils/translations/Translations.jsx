import LocalizedStrings from 'react-localization';
import english from './languages/English';
import polish from './languages/Polish';
import greek from './languages/Greek';
import french from './languages/French';

const strings = new LocalizedStrings({
  en: english,
  pl: polish,
  gr: greek,
  fr: french,
});

// strings.setLanguage('fr');

export default strings;
