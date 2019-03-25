const fs = require('fs');
const axios = require('axios');
const plist = require('plist');
const cheerio = require('cheerio');
const countries = require('./countries.json');


async function fetchLanguage(storefrontId, languageCode) {
  const { data } = await axios.get('https://init.itunes.apple.com/bag.xml', {
    headers: {
      'X-Apple-Store-Front': `${storefrontId}-${languageCode},32`,
    },
  });

  const $ = cheerio.load(data);

  let plistNode = $('Protocol').html();

  // ¯\_(ツ)_/¯
  plistNode = plistNode.replace('<true>', '<true />');
  plistNode = plistNode.replace('<false>', '<false />');

  const plistData = plist.parse(plistNode);

  return {
    id: plistData.metrics.metricsBase.language,
    code: plistData.urlBag.language,
  };
}

async function fetchLanguages() {
  const languages = [];

  for (let i = 0; i < 80; i++) {
    console.log(`Fetching language ${i}`);

    const language = await fetchLanguage(countries[0].storefrontId, i);

    if (i == language.id) {
      languages.push(language);
    }
  }

  return languages;
}

async function fetchLanguageForCountry(country, language) {
  console.log(`Language: ${language.code}`);

  const storeFrontHeader = `${country.storefrontId}-${language.id},32 t:music31`;

  try {
    const { data } = await axios.get('https://itunes.apple.com/WebObjects/MZStore.woa/wa/musicBrowseNavigation', {
      headers: {
        'X-Apple-Store-Front': storeFrontHeader,
      },
    });

    console.log(`OK`);

    const sections = {};

    for (const link of data.pageData.links) {
      const key = link.path.replace('browse-', '');

      if (link.url) {
        sections[key] = link;
      }
    }

    return {
      ...language,
      sections,
    };
  } catch (e) {
    console.log(`KO: ${e.response && e.response.status}`);

    if (!e.response || ![400, 500].includes(e.response.status)) {
      console.error(e);
    }

    return null;
  }
}

async function fetchLanguagesForCountry(languages, country) {
  console.log(`Fetching languages for ${country.code}`);

  const countryLanguages = [];

  for (const language of languages) {
    const countryLanguage = await fetchLanguageForCountry(country, language);
    if (countryLanguage) {
      countryLanguages.push(countryLanguage);
    }
  }

  return countryLanguages;
}

(async () => {
  const languages = await fetchLanguages();

  console.log(languages);

  const mapping = [];
  for (const country of countries) {
    const countryLanguages = await fetchLanguagesForCountry(languages, country);

    mapping.push({
      ...country,
      languages: countryLanguages,
    });
  }

  console.log(mapping);

  fs.writeFileSync(__dirname + '/mapping.json', JSON.stringify(mapping));
})();
