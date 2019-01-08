const querystring = require('querystring');
const secrets = require('../secrets.json');
const utils = require('../utils.js');

const axios = require('axios').create({
  baseURL: 'https://api.genius.com',
  headers: {
    Authorization: `Bearer ${secrets.GENIUS_API_KEY}`,
  },
});

async function findMatch(hits) {
  if(hits.length === 0) {
    return null;
  }

  for (const hit of hits) {
    console.log(hit);
    if (hit.type === "artist") {
      console.log('hit artist');
      return hit.result;
    }
  }

  return null;
}

async function fetchArtist(hit) {
  const {data} = await axios.get(hit.api_path);
  console.log('api_path', data);

  return data.response.artist;
}

async function fetchHits(artist) {
  try {
    const { data } = await axios.get(`https://genius.com/api/search/multi?q=${artist}`, { 'headers': {} });

    const { hits } = data.response.sections.find(s => s.type === 'artist');

    return hits;
  } catch (error) {
    console.error(error);
  }

  return null;
}

async function handle({ artist }) {
  const hits = await fetchHits(artist);

  if (!hits) {
    return null;
  }

  const match = await findMatch(hits);

  if(match) {
    return await fetchArtist(match);
  }

  return null;
}

module.exports = {
  details: async function(event) {
    const params = event.queryStringParameters;

    try {
      const hit = await handle(params);

      return utils.generateResponse(200, hit);
    } catch (e) {
      return utils.generateError(500, e);
    }
  }
};
