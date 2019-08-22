import React from 'react';
import translate from '../../../../utils/translations/Translations';
import AlbumItem from '../../../Common/AlbumItem/AlbumItem';
import InfiniteLoader, {
  InfiniteLoaderOnScroll,
  InfiniteLoaderState,
} from '../../../Common/InfiniteLoader/InfiniteLoader';
import PageContent from '../../../Common/PageContent/PageContent';
import PageTitle from '../../../Common/PageTitle/PageTitle';
import PlaylistItem from '../../../Common/PlaylistItem/PlaylistItem';
import classes from './RecentlyAddedPage.scss';

export default class RecentlyAddedPage extends React.Component {
  public static async load(params: MusicKit.QueryParameters) {
    const music = MusicKit.getInstance();

    return music.api.library.collection('recently-added', null, params);
  }

  public static renderItems({ items }: InfiniteLoaderState<any>) {
    if (!items) {
      return null;
    }

    return (
      <div className={classes.artworkItemGrid}>
        {items.map((item: any) => {
          switch (item.type) {
            case 'library-playlists':
              return <PlaylistItem key={item.id} playlist={item} size={150} />;
            case 'library-albums':
              return <AlbumItem key={item.id} album={item} size={150} />;
            default:
              return null;
          }
        })}
      </div>
    );
  }

  public static renderContent(_: InfiniteLoaderOnScroll, state: InfiniteLoaderState<any>) {
    return RecentlyAddedPage.renderItems(state);
  }

  private readonly ref = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={translate.recentlyAdded} context={translate.myLibrary} />

        <InfiniteLoader
          scrollElement={this.ref}
          load={RecentlyAddedPage.load}
          render={RecentlyAddedPage.renderContent}
          limit={10}
        />
      </PageContent>
    );
  }
}
