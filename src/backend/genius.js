const querystring = require('querystring');
const secrets = require('./secrets.json');

const axios = require('axios').create({
  baseURL: 'https://api.genius.com',
  headers: {
    Authorization: `Bearer ${secrets.GENIUS_API_KEY}`,
  },
});

const corsOrigin = '*';

function generateResponse (code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(payload)
  }
}

function generateError (code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(err)
  }
}

async function findMatch(hits) {
  if(hits.length === 0) {
    return null;
  }

  for (const hit of hits) {
    if (hit.type === "song") {
      return hit.result;
    }
  }

  return null;
}

async function fetchSong(hit) {
  const {data} = await axios.get(hit.api_path);

  return data.response.song;
}

async function fetchHits(name, artist) {
  try {
    const qs = querystring.stringify({q: `${name}+${artist}`});
    const { data } = await axios.get(`/search?${qs}`);

    const { hits } = data.response;

    return hits;
  } catch (error) {
    console.error(error);
  }

  return null;
}

async function handle({ name, artist }) {
  const hits = await fetchHits(name, artist);

  if (!hits) {
    return null;
  }

  const match =  await findMatch(hits);

  if(match) {
    return await fetchSong(match);
  }

  return null;
}

module.exports = {
  song: async function(event) {
    const params = event.queryStringParameters;

    try {
      const hit = await handle(params);

      return generateResponse(200, hit);
    } catch (e) {
      return generateError(500, e);
    }
  }
};
