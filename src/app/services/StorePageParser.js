export const LayoutTypes = {
  FEATURE: 316,
  // GENRES: 322,
  TILE: 326,
  SONG: 327,
  TILE_WIDE: 385,
  TILE_LARGE: 387,
  LINK: 391,
};

export const ContentTypes = {
  SONG: 1,
  ALBUM: 2,
  PLAYLIST: 46,
  // RADIO: 51, TODO: Is this radio, or is it radio video recording? How does radio even work?
  FEATURED_ITEM: 317,
  // FEATURED_PAGE: 320, TODO: PAGE? What really is this type?
  TILE_WIDE: 386,
  // TODO: ARTISTS
  // TODO: MUSIC VIDEOS?
  // TODO: OTHERS???
};

export async function normalisePageData(page) {
  function normaliseItem(item) {
    if (parseInt(item.fcKind, 10) === ContentTypes.FEATURED_ITEM) {
      const featuredContent = normaliseItem(item.link);
      if (!featuredContent) {
        return null;
      }
      return {
        tag: item.designBadge,
        item: featuredContent,
      };
    }

    let typeId;
    if (item.kindIds && item.kindIds.length > 0) {
      [typeId] = item.kindIds;
    } else if (item.link.kindIds && item.link.kindIds.length > 0) {
      [typeId] = item.link.kindIds;
    } else {
      return null;
    }

    const contentId = item.contentId || item.link.contentId;
    if (!contentId) {
      return null;
    }

    const { storefrontId } = MusicKit.getInstance().api;

    const itemData = page.storePlatformData.lockup.results[contentId];

    if (!itemData) {
      return null;
    }

    switch (typeId) {
      case ContentTypes.ALBUM:
        return {
          id: itemData.id,
          type: 'albums',
          href: `/v1/catalog/${storefrontId}/albums/${itemData.id}`,
          attributes: {
            artwork: itemData.artwork,
            editorialArtwork: itemData.editorialArtwork,
            artistName: itemData.artistName,
            isSingle: itemData.trackCount === 1,
            url: itemData.url,
            isComplete: false, // TODO: This.
            genreNames: itemData.genreNames,
            trackCount: 21, // TODO: This.
            isMasteredForItunes: false, // TODO: This.
            releaseDate: itemData.releaseDate,
            name: itemData.name,
            // recordLabel: '???', TODO: This.
            copyright: itemData.copyright,
            playParams: {
              id: itemData.id,
              kind: 'album',
            },
            editorialNotes: itemData.itunesNotes,
            contentRating: 'explicit', // TODO: this. Do we always just check for RIAA rating?
          },
        };
      case ContentTypes.PLAYLIST:
        return {
          id: itemData.id,
          type: 'playlists',
          playlistType: itemData.playlistType,
          href: `/v1/catalog/${storefrontId}/playlists/${itemData.id}}`,
          attributes: {
            name: itemData.name,
            curatorName: itemData.curatorName,
            description: itemData.description,
            url: itemData.url,
            artwork: {
              ...itemData.artwork,
              url: itemData.artwork.url.replace('{c}', 'cc'),
            },
            editorialArtwork: itemData.editorialArtwork,
            lastModifiedDate: itemData.lastModifiedDate,
            playParams: {
              id: itemData.id,
              kind: 'playlist',
            },
          },
        };
      case ContentTypes.SONG:
        return {
          id: itemData.id,
          type: 'songs',
          href: `/v1/catalog/${storefrontId}/songs/${itemData.id}`,
          attributes: {
          //  previews: [
          //    {
          //      url: 'https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview123/v4/5f/e7/79/5fe77930-23e7-e2bc-f481-0aaefa11a767/mzaf_5210516116320012511.plus.aac.p.m4a'
          //    },
          //  ],
            artwork: itemData.artwork,
            artistName: itemData.artistName,
            url: itemData.url,
            discNumber: itemData.discNumber,
            genreNames: itemData.genreNames,
            // durationInMillis:
            //  itemData.offers.find(offer => offer.type === 'buy').assets[0].duration * 1000,
            releaseDate: itemData.releaseDate,
            name: itemData.name,
            // isrc: 'USSM11809229',
            albumName: itemData.collectionName,
            playParams: {
              id: itemData.id,
              kind: 'song',
            },
            trackNumber: itemData.trackNumber,
            composerName: itemData.composer && itemData.composer.name,
          },
        };
      default:
        console.error(`Unexpected type id: ${typeId}, found in set`);
        return null;
    }
  }

  function normaliseItems(items) {
    return items.reduce((acc, item) => {
      const content = normaliseItem(item);
      if (!content) {
        return acc;
      }

      return acc.concat(content);
    }, []);
  }

  const sections = page.pageData.fcStructure.model.children.reduce((accum, section) => {
    const layoutType = Object.keys(LayoutTypes).find(
      type => LayoutTypes[type] === parseInt(section.fcKind, 10)
    );

    if (!layoutType) {
      console.log(`Skipping non supported section layout type: ${section.fcKind}`);
      return accum;
    }

    let items = [];
    const content = section.content || section.children;
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

  let meta = {};

  const pageMetaItem =
    page.pageData.id &&
    page.storePlatformData &&
    page.storePlatformData.product &&
    page.storePlatformData.product.results &&
    page.storePlatformData.product.results[page.pageData.id];
  if (pageMetaItem) {
    meta = { ...meta, ...pageMetaItem };
  }

  return {
    ...meta,
    content: sections,
  };
}
