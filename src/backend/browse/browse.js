const utils = require('../utils');
const appleMusicApi = require('../appleMusicApi');

const contentTypes = {
  ALBUM: 2,
  PLAYLIST: 46,
};

async function charts({ storefront }) {
  const chartsData = await appleMusicApi.fetchCharts(storefront);

  return chartsData;
}

async function overview({ storefront }) {
  const data = await appleMusicApi.fetchBrowseData('143444-2,32 t:music31');
  const response = {};

  //console.log(data.pageData.fcStructure);

  const content = {
    songs: {},
    albums: {},
    playlists: {},
  };

  const pageSections = data.pageData.fcStructure.model.children;
  // sections::
  // 0: features
  // 1: genres
  // 2: playlists
  // 3: hot songs
  // 4: music video playlists
  // 5: new releases (albums)
  // 6: videos
  // 7: coming soon
  // 8:
  // 9:
  // 10:
  // 11:

  response.features = pageSections[0].children.reduce((acc, feature) => {
    // TODO: Artists
    const typeId = feature.link.kindIds && feature.link.kindIds[0];

    if (!typeId) {
      return acc;
    }

    switch (typeId) {
      case contentTypes.ALBUM:
        content.albums[feature.contentId] = null;
        return [...acc, feature.link.contentId];
      case contentTypes.PLAYLIST:
        content.albums[feature.contentId] = null;
        return [...acc, feature.link.contentId];
      default:
        console.error(`Unexpected type id: ${typeId}, found in features`);
        return acc;
    }
  }, []);

  response.playlists = pageSections[2].content.map(playlist => {
    content.playlists[playlist.contentId] = null;
    return playlist.contentId;
  });

  response.hotSongs = pageSections[3].content.map(song => {
    content.songs[song.contentId] = null;
    return song.contentId;
  });

  response.newReleases = pageSections[5].content.map(album => {
    content.albums[album.contentId] = null;
    return album.contentId;
  });

  response.comingSoon = pageSections[7].content.map(album => {
    content.albums[album.contentId] = null;
    return album.contentId;
  });

  // Add lookup content info from apple music API
  // TODO: STOREFRONT MAPPINGS
  content.albums = (await appleMusicApi.fetchAlbums('us', Object.keys(content.albums))).map(album => {
    delete album.relationships;
    return album;
  });

  response.lookup = content;

  return response;
}

module.exports = {
  overview: async function(event) {
    try {
      const params = event.queryStringParameters;

      const browseData = await overview(params);

      return utils.generateResponse(200, browseData);
    } catch (e) {
      return utils.generateError(500, e);
    }
  }
};
