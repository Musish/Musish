import React from 'react';
import Loader from '../../common/Loader';

import AlbumItem from './AlbumItem';

import Classes from './Albums.scss';
import PageTitle from "../../common/PageTitle";
import InfiniteScroll from '../common/InfiniteScroll';
import PageContent from "../Layout/PageContent";

export default class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderContent = this.renderContent.bind(this);
  }

  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.albums(null, params);
  }

  renderItems(items, more, {loading, end}) {
    if (!items) {
      return <Loader/>
    }

    const albums = items.map(
      (album, i) => {
        const WHEIGHT = 150;
        let url = MusicKit.formatArtworkURL(album.attributes.artwork, WHEIGHT, WHEIGHT);

        return (
          <AlbumItem key={i} url={url} id={album.id} title={album.attributes.name} name={album.attributes.artistName}/>
        );
      });

    return (
      <>
        <div className={Classes.albumsGrid}>
          {albums}
        </div>
        {loading && <Loader/>}
      </>
    )
  }

  renderContent(...args) {
    return (
      <>
        <PageTitle title={"Albums"} context={"My Library"}/>

        {this.renderItems(...args)}
      </>
    )
  }

  render() {
    return (
      <PageContent>
        <InfiniteScroll load={this.load} render={this.renderContent}/>
      </PageContent>
    );
  }
}
