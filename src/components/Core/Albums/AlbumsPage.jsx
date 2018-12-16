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

    this.ref = React.createRef();

    this.renderContent = this.renderContent.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.albums(null, params);
  }

  renderItems({items}) {
    const albums = items.map(
      (album, i) => {
        const WHEIGHT = 150;
        let url = MusicKit.formatArtworkURL(album.attributes.artwork, WHEIGHT, WHEIGHT);

        return (
          <AlbumItem key={i} url={url} id={album.id} title={album.attributes.name} name={album.attributes.artistName}/>
        );
      });

    return (
      <div className={Classes.albumsGrid}>
        {albums}
      </div>
    )
  }

  onScroll({target: {scrollTop, scrollHeight, clientHeight}}, onScroll) {
    onScroll({scrollTop, scrollHeight, clientHeight})
  }

  renderContent({onScroll}, state) {
    return this.renderItems(state)
  }

  render() {
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={"Albums"} context={"My Library"}/>

        <InfiniteLoader scrollElement={this.ref} load={this.load} render={this.renderContent}/>
      </PageContent>
    );
  }
}
