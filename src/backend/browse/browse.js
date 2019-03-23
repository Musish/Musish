const utils = require('../utils');
const appleMusicApi = require('../appleMusicApi');

const contentTypes = {
  SONG: 1,
  ALBUM: 2,
  PLAYLIST: 46,
  // TODO: ARTISTS
  // TODO: MUSIC VIDEOS?
  // TODO: OTHERS???
};

async function overview({ storefront }) {
  // TODO: STOREFRONT MAPPINGS
  const data = await appleMusicApi.fetchBrowseData('143444-2,32 t:music31');
  const response = {};

  //console.log(data.pageData.fcStructure);

  const content = {
    songs: new Set([]),
    albums: new Set([]),
    playlists: new Set([]),
  };

  function normaliseItems(items) {
    return items.reduce((acc, item) => {
      // TODO: Artists
      const typeId = item.link.kindIds && item.link.kindIds[0];

      if (!typeId) {
        return acc;
      }

      switch (typeId) {
        case contentTypes.ALBUM:
          content.albums.add(item.contentId);
          return [...acc, item.link.contentId];
        case contentTypes.PLAYLIST:
          content.playlists.add(item.contentId);
          return [...acc, item.link.contentId];
        default:
          console.error(`Unexpected type id: ${typeId}, found in set`);
          return acc;
      }
    }, [])
  }

  // Nope, these change.
  // ITUNES STORE SECTIONS:
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

  // NEW MUSIC SECTION: FEATURES
  response.features = normaliseItems(pageSections[0].children);

  // NEW MUSIC SECTION: PLAYLISTS
  response.playlists = pageSections[2].content.map(playlist => {
    content.playlists.add(playlist.contentId);
    return playlist.contentId;
  });

  // NEW MUSIC SECTION: HOT SONGS
  response.hotSongs = pageSections[3].content.map(song => {
    content.songs.add(song.contentId);
    return song.contentId;
  });

  // NEW MUSIC SECTION: NEW RELEASES
  response.newReleases = pageSections[5].content.map(album => {
    content.albums.add(album.contentId);
    return album.contentId;
  });

  // NEW MUSIC SECTION: COMING SOON
  response.comingSoon = pageSections[7].content.map(album => {
    content.albums.add(album.contentId);
    return album.contentId;
  });

  // Add lookup content info from apple music API
  response.lookup = { };

  const albumPayloads = await appleMusicApi.fetchAlbums(storefront, Array.from(content.albums));
  albumPayloads.forEach(album => {
    delete album.relationships;
    response.lookup[album.id] = album;
  });

  const playlistPayloads = await appleMusicApi.fetchPlaylists(storefront, Array.from(content.playlists));
  playlistPayloads.forEach(playlist => {
    delete playlist.relationships;
    response.lookup[playlist.id] = playlist;
  });

  const songPayloads = await appleMusicApi.fetchSongs(storefront, Array.from(content.songs));
  songPayloads.forEach(song => {
    delete song.relationships;
    response.lookup[song.id] = song;
  });

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
