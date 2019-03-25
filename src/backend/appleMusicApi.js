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
  fetchAlbums: async (storefront, ids) => {
    let albums = [];

    for (let i = 0, j = ids.length; i < j; i += 100) {
      const blockIds = ids.slice(i, i + 100);

      const idParams = blockIds.reduce((acc, id) => acc + `,${id}`);

      try {
        const { data } = await axios.get(`/v1/catalog/${storefront}/albums`, {
          params: {
            ids: idParams,
            include: null,
          }
        });

        albums = [...albums, ...data.data];
      } catch (error) {
        console.error(error);
      }
    }

    return albums;
  },
  fetchPlaylists: async (storefront, ids) => {
    let playlists = [];

    for (let i = 0, j = ids.length; i < j; i += 25) {
      const blockIds = ids.slice(i, i + 25);

      const idParams = blockIds.reduce((acc, id) => acc + `,${id}`);

      try {
        const { data } = await axios.get(`/v1/catalog/${storefront}/playlists`, {
          params: {
            ids: idParams,
          }
        });

        playlists = [...playlists, ...data.data];
      } catch (error) {
        console.error(error);
      }
    }

    return playlists;
  },
  fetchSongs: async (storefront, ids) => {
    let songs = [];

    for (let i = 0, j = ids.length; i < j; i += 300) {
      const blockIds = ids.slice(i, i + 300);

      const idParams = blockIds.reduce((acc, id) => acc + `,${id}`);

      try {
        const { data } = await axios.get(`/v1/catalog/${storefront}/songs`, {
          params: {
            ids: idParams,
          }
        });

        songs = [...songs, ...data.data];
      } catch (error) {
        console.error(error);
      }
    }

    return songs;
  },
  fetchBrowseData: async (storefrontIdentifier) => {
    try {
      const { data } = await axios.get(
        'https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewGrouping?id=130',
        {
          headers: { 'x-apple-store-front': storefrontIdentifier }
        }
      );

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  fetchActivityData: async (storefrontIdentifier, storefront, key, id) => {
    try {
      const { data } = await axios.get(
        `https://itunes.apple.com/${storefront}/activity/${key}/${id}`,
        {
          headers: { 'x-apple-store-front': storefrontIdentifier }
        }
      );

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
