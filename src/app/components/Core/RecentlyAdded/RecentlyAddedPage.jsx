import React from 'react';
import AlbumItem from '../Albums/AlbumItem';
import classes from './RecentlyAddedPage.scss';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import InfiniteLoader from '../common/InfiniteLoader';

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
    const albums = items.map(album => <AlbumItem key={album.id} album={album} size={170} />);

    return <div className={classes.albumsGrid}>{albums}</div>;
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
