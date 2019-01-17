const secrets = require('./secrets.json');

const axios = require('axios').create({
  baseURL: 'https://api.music.apple.com',
  headers: {
    Authorization: `Bearer ${secrets.APPLE_TOKEN}`,
  },
});

module.exports = {
  fetchArtist: async (artistId) => {
    try {
      const { data } = await axios.get(`/v1/catalog/us/artists/${artistId}`);

      return data.data[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  fetchCharts: async (storefront) => {
    try {
      const { data } = await axios.get(`/v1/catalog/${storefront}/charts`, {
        params: {
          types: 'songs,albums,playlists',
          limit: 36
        }
      });

      return data.results;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  fetchAppleCurator: async (storefront, curator) => {
    try {
      const { data } = await axios.get(`/v1/catalog/${storefront}/apple-curators/${curator}`, {
        params: {
          types: 'songs,albums,playlists',
          limit: 36
        }
      });

      return data.results;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
