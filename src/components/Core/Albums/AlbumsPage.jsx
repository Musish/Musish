import React from 'react';
import Loader from '../../common/Loader';

import AlbumItem from './AlbumItem';

import Classes from './Albums.scss';
import PageTitle from "../../common/PageTitle";
import PageContent from "../Layout/PageContent";
import InfiniteLoader from "../common/InfiniteLoader";
import Modal from "../../common/Modal/Modal";
import ArtistsPage from "../Artists/ArtistsPage";
import AlbumsPanel from "./AlbumPanel";

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
        return (
          <AlbumItem key={i} album={album} size={170} />
        );
      });

    return (
      <>
        <div className={Classes.albumsGrid}>
          {albums}
        </div>
        {loading && <Loader />}
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
        <Modal render={() => (
          <AlbumsPanel id={"l.3nJoOaz"}  />
        )} />
        <InfiniteLoader load={this.load} render={this.renderContent}/>
      </PageContent>
    );
  }
}
