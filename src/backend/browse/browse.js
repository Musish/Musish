const utils = require('../utils');
const appleMusicApi = require('../appleMusicApi');

async function charts({ storefront }) {
  const chartsData = await appleMusicApi.fetchCharts(storefront);
  return chartsData;
}

async function playlists({ storefront }) {
  const playlistsData = await appleMusicApi.fetchCharts(storefront);
  return playlistsData;
}

module.exports = {
  charts: async function(event) {
    try {
      const params = event.queryStringParameters;
      const chartsData = await charts(params);
      return utils.generateResponse(200, chartsData);
    } catch (e) {
      return utils.generateError(500, e);
    }
  },
  playlists: async function(event) {
    try {
      const params = event.queryStringParameters;
      const playlistsData = await playlists(playlistsData);
      return utils.generateResponse(200, playlistsData);
    } catch (e) {
      return utils.generateError(500, e);
    }
  }
};
