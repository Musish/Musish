const utils = require('../utils');
const appleMusicApi = require('../appleMusicApi');

async function charts({ storefront }) {
  const chartsData = await appleMusicApi.fetchCharts(storefront);

  return chartsData;
}

async function overview({ storefront }) {
  const data = await appleMusicApi.fetchBrowseData('143444-2,32 t:music31');

  console.log(data.pageData.fcStructure);

  const featuredContent = [];
  for ()

  const response = {

  };

  return data;
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
