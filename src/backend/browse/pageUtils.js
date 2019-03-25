const { ContentTypes, LayoutTypes } = require('./dataTypes');

module.exports = {
  normalisePage(page) {
    const contentIds = { }; // Mapped from contentType to array of ids

    function normaliseItem(item) {
      if (parseInt(item.fcKind) === ContentTypes.FEATURED_ITEM) {
        const itemId = normaliseItem(item.link);
        if (!itemId) {
          return null;
        }
        return {
          tag: item.designBadge,
          itemId,
        };
      }

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
        case ContentTypes.ALBUM:
        case ContentTypes.PLAYLIST:
        case ContentTypes.SONG:
          if (!contentIds[typeId]) {
            contentIds[typeId] = [];
          }
          contentIds[typeId].push(contentId);
          return contentId;
        default:
          console.error(`Unexpected type id: ${typeId}, found in set`);
          return null;
      }
    }

    function normaliseItems(items) {
      return items.reduce((acc, item) => {
        const content = normaliseItem(item);
        if (!content) {
          console.log(item);
          return acc;
        }

        return acc.concat(content);
      }, [])
    }

    const sections = page.pageData.fcStructure.model.children.reduce((accum, section) => {
      const layoutType = Object.keys(LayoutTypes).find(type => LayoutTypes[type] === parseInt(section.fcKind));

        if (!layoutType) {
          console.log(`Skipping non supported section layout type: ${section.fcKind}`);
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

    return {
      meta: {

      }
    }
  }
};