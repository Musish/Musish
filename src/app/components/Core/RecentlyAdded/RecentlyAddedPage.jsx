import React from 'react';
import AlbumItem from '../Albums/AlbumItem';
import classes from './RecentlyAddedPage.scss';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import InfiniteLoader from '../common/InfiniteLoader';
import PlaylistItem from '../Playlists/PlaylistItem';

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
              return <PlaylistItem key={item.id} playlist={item} size={170} />;
            case 'library-albums':
              return <AlbumItem key={item.id} album={item} size={170} />;
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
        <PageTitle title={'Recently Added'} context={'My Library'} />

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
