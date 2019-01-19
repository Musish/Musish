const querystring = require('querystring');
const utils = require('../utils');
const { stringComparator, geniusAxios: axios } = require('../utils');

async function findMatch(hits, { name, artist }) {
  if (hits.length === 0) {
    return null;
  }

  for (const hit of hits) {
    const { type, result } = hit;

    if (type === 'song') {
      if (stringComparator(result.title_with_featured, name)) {
        if (stringComparator(result.primary_artist.name, artist)) {
          return result;
        }
      }
    }
  }

  return null;
}

async function fetchSong(hit) {
  const { data } = await axios.get(hit.api_path);

  return data.response.song;
}

async function fetchHits(name, artist) {
  try {
    const qs = querystring.stringify({ q: `${name} ${artist}` });
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

  const match = await findMatch(hits, { name, artist });

  if (match) {
    return await fetchSong(match);
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
