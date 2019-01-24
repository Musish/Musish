const { compareTwoStrings } = require('string-similarity');
const secrets = require('./secrets.json');

const corsOrigin = '*';

function normalizeSring(s) {
  return s.toLowerCase().replace(/[^0-9a-z]/gi, '');
}

const geniusAxios = require('axios').create({
  baseURL: 'https://api.genius.com',
  headers: {
    Authorization: `Bearer ${secrets.GENIUS_API_KEY}`,
  },
});

module.exports = {
  generateResponse: (code, payload) => {
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(payload),
    };
  },
  generateError: (code, err) => {
    console.log(err);
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(err),
    };
  },
  stringComparator: (a, b) => {
    const na = normalizeSring(a);
    const nb = normalizeSring(b);

    const s = compareTwoStrings(na, nb);

    return s >= 0.8;
  },
  geniusAxios,
};
