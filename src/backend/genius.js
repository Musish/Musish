const querystring = require('querystring');
const axios = require('axios').create({
  baseURL: 'https://api.genius.com',
  headers: {
    Authorization: 'Bearer hIO0WBirFnRNrnpI0hE4jFz6vGuhF6jKY4L3jpLSFPAPq4aa33BRQycxDQlC6Ytt',
  },
});

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
  return hits[0];
}

async function fetchHits(name, artist) {
  try {
    const qs = querystring.stringify({q: `${name} ${artist}`});
    const { data } = await axios.get(`/search?${qs}`);

    const { hits } = data.response;

    return hits;
  } catch (error) {
    console.error(error);
  }

  return null;
}

async function handle(params) {
  const { name, artist, appleMusicId } = params;

  const hits = await fetchHits(name, artist);

  if (!hits) {
    return null;
  }

  return await findMatch(hits, appleMusicId);
}

module.exports = {
  song: async function(event) {
    const params = event.queryStringParameters;

    return generateResponse(200, await handle(params));
  }
};
