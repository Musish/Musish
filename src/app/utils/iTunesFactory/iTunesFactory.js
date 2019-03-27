import AlbumFactory from './ItemFactories/AlbumFactory';
import PlaylistFactory from './ItemFactories/PlaylistFactory';
import SongFactory from './ItemFactories/SongFactory';
import GroupingPageFactory from './PageFactories/GroupingPageFactory';
import FeatureFactory from './ItemFactories/FeatureFactory';
import SongsFactory from './ItemFactories/SongsFactory';

export const ContentTypes = {
  SONG: 1,
  ALBUM: 2,
  PLAYLIST: 46,
  // RADIO: 51, TODO: Is this radio, or is it radio video recording? How does radio even work?
  FEATURE: 316,
  FEATURED_ITEM: 317,
  // FEATURED_PAGE: 320, TODO: PAGE? What really is this type?
  // GENRES: 322,
  TILE: 326,
  SONG_LIST: 327,
  WIDE_TILE_LIST: 385,
  WIDE_TILE: 386,
  LARGE_TILE: 387,
  LINK: 391,
  // TODO: ARTISTS
  // TODO: MUSIC VIDEOS?
  // TODO: OTHERS???
};

export default function build(item, lockup) {
  // First check if page
  if (item.pageData) {
    switch (item.pageData.componentName) {
      case 'grouping_page':
        return GroupingPageFactory(item);
      default:
        console.error(`page type not supported by factory: ${item.pageData.componentName}`);
        return null;
    }
  }

  // Else check if we have a specific factory for our fcKind
  if (item.fcKind === ContentTypes.SONGS) {
    return SongsFactory(item, lockup);
  }

  // If has specific content type id
  if (item.kindIds && item.kindIds.length === 1) {
    const contentTypeId = item.kindIds[0];
    switch (contentTypeId) {
      case ContentTypes.SONG:
        return SongFactory(item, lockup);
      case ContentTypes.ALBUM:
        return AlbumFactory(item, lockup);
      case ContentTypes.PLAYLIST:
        return PlaylistFactory(item, lockup);
      case ContentTypes.FEATURE:
        return FeatureFactory(item, lockup);
      default:
        console.error(`Unexpected type id: ${contentTypeId}, found in set`);
        return null;
    }
  }

  return null;
}
