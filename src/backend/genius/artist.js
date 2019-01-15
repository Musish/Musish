const utils = require('../utils');
const appleMusicApi = require('../appleMusicApi');
const { stringComparator, geniusAxios } = require('../utils');
const axios = require('axios');

async function findMatch(hits, name) {
  if (hits.length === 0) {
    return null;
  }

  for (const hit of hits) {
    if (hit.type === 'artist' && stringComparator(hit.result.name, name)) {
      return hit.result;
    }
  }

  for (const hit of hits) {
    if (hit.type === 'artist') {
      return hit.result; // Returns the first artist it finds, if it cannot find one which directly matches the name.
    }
  }

  return null;
}

async function fetchArtist(hit) {
  const { data } = await geniusAxios.get(hit.api_path);

  const artist = data.response.artist;
  delete artist.current_user_metadata;

  return artist;
}

async function fetchHits(artist) {
  try {
    const { data } = await axios.get(`https://genius.com/api/search/multi?q=${artist}`);

    const { hits } = data.response.sections.find(s => s.type === 'artist');

    return hits;
  } catch (error) {
    console.error(error);
  }

  return null;
}

async function handle({ artistId }) {
  const appleArtistData = await appleMusicApi.fetchArtist(artistId);
  const artistName = appleArtistData.attributes.name;

  const hits = await fetchHits(artistName);

  if (!hits) {
    return null;
  }

  const match = await findMatch(hits, artistName);

  if (match) {
    return await fetchArtist(match);
  }

  return null;
}

module.exports = {
  async details(event) {
    const params = event.queryStringParameters;

    try {
      const hit = await handle(params);

      return utils.generateResponse(200, hit);
    } catch (e) {
      return utils.generateError(500, e);
    }
  },
};
