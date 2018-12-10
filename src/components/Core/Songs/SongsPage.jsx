import React from 'react';
import SongList from '../common/SongList/SongList';
import InfiniteScroll from '../common/InfiniteScroll';
import Loader from '../../common/Loader';
import PageTitle from '../../common/PageTitle';
import PageContent from "../Layout/PageContent";

export default class SongsPage extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.songs(null, params);
  }

  renderItems(items, more, {loading, end}) {
    return (
      <>
        <PageTitle title={"Songs"} context={"My Library"}/>
        <SongList
          songs={items}
          album={false}
          showAlbum={true}
          showArtist={true}
        />
        {loading && <Loader/>}
      </>
    );
  }

  render() {
    return (
      <PageContent>
        <InfiniteScroll load={this.load} render={this.renderItems}/>
      </PageContent>
    );
  }
}
