import React from 'react';
import Loader from '../../common/Loader';

import AlbumItem from './AlbumItem';

import Classes from './Albums.scss';
import PageTitle from "../../common/PageTitle";
import PageContent from "../Layout/PageContent";
import InfiniteLoader from "../common/InfiniteLoader";

export default class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderContent = this.renderContent.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.albums(null, params);
  }

  renderItems({items, loading}) {
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

  onScroll({target: {scrollTop, scrollHeight, clientHeight}}, onScroll) {
    onScroll({scrollTop, scrollHeight, clientHeight})
  }

  renderContent({onScroll}, state) {
    return (
      <div onScroll={e => this.onScroll(e, onScroll)}
           style={{height: '100%', overflow: 'auto'}}>
        <PageTitle title={"Albums"} context={"My Library"}/>

        {this.renderItems(state)}
      </div>
    )
  }

  render() {
    return (
      <PageContent>
        <InfiniteLoader load={this.load} render={this.renderContent}/>
      </PageContent>
    );
  }
}
