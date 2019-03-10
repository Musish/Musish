import React from 'react';
import AlbumItem from '../../../../Common/AlbumItem/AlbumItem';
import classes from './RecentlyAddedPage.scss';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import PageContent from '../../../../Common/PageContent/PageContent';
import InfiniteLoader from '../../../../Common/InfiniteLoader/InfiniteLoader';
import PlaylistItem from '../../../../Common/PlaylistItem/PlaylistItem';
import translate from '../../../../../utils/translations/Translations';

export default class RecentlyAddedPage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  static async load(params) {
    const music = MusicKit.getInstance();

    return music.api.library.collection('recently-added', null, params);
  }

  static renderItems({ items }) {
    return (
      <div className={classes.artworkItemGrid}>
        {items.map(item => {
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

  static renderContent({ onScroll }, state) {
    return RecentlyAddedPage.renderItems(state);
  }

  render() {
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
