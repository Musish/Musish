const utils = require('../utils');
const appleMusicApi = require('../appleMusicApi');
const dataTypes = require('./dataTypes');

async function overview({ storefront, key, id }) {
  const data = await appleMusicApi.fetchActivityData('143444-2,32 t:music31', 'gb', key, id);
  const response = {};

  const content = {
    playlists: new Set([]),
  };

  function normaliseItem(item) {
    let typeId;
    if (item.kindIds && item.kindIds[0]) {
      typeId = item.kindIds[0];
    } else if (item.link.kindIds && item.link.kindIds[0]) {
      typeId = item.link.kindIds[0];
    } else {
      return null;
    }

    let contentId;
    if (item.contentId) {
      contentId = item.contentId;
    } else if (item.link.contentId) {
      contentId = item.link.contentId;
    } else {
      return null;
    }

    switch (typeId) {
      case dataTypes.contentTypes.PLAYLIST:
        content.playlists.add(contentId);
        return contentId;
      default:
        console.error(`Unexpected type id: ${typeId}, found in set`);
        return null;
    }
  }

  function normaliseItems(items) {
    return items.reduce((acc, item) => {
      // TODO: Artists

      const content = normaliseItem(item);
      if (!content) {
        console.log(item);
        return acc;
      }

      return acc.concat(content);
    }, [])
  }

  response.sections = data.pageData.fcStructure.model.children
    .reduce((accum, section) => {
      const layoutType = Object.keys(dataTypes.layoutTypes).find(type => dataTypes.layoutTypes[type] === parseInt(section.fcKind));

      if (!layoutType) {
        console.log(`Found non supported layout type: ${section.fcKind}`);
        return accum;
      }

      let items = [];
      let content = section.content || section.children;
      if (content) {
        items = normaliseItems(content);
      }

      if (items.length === 0) {
        return accum;
      }

      return accum.concat({
        name: section.name,
        content: items,
        type: layoutType,
      });
    }, []);

  // Add lookup content info from apple music API
  response.lookup = { };

  const playlistPayloads = await appleMusicApi.fetchPlaylists(storefront, Array.from(content.playlists));
  playlistPayloads.forEach(playlist => {
    delete playlist.relationships;
    response.lookup[playlist.id] = playlist;
  });

  return response;
}

module.exports = {
  overview: async  function(event) {
    try {
      const params = event.queryStringParameters;

      const activityData = await overview(params);

      return utils.generateResponse(200, activityData);
    } catch (e) {
      return utils.generateError(500, e);
    }
  },
};
