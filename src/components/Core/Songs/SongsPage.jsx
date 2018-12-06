import React from 'react';
import SongList from '../common/SongList/SongList';
import PaginatedResults from '../common/PaginatedResults';
import MainPaginatedResults from '../common/MainPaginatedResults';
import Loader from '../../common/Loader';
import PageTitle from '../../common/PageTitle';
import Page from "../Layout/Page";

export default class SongsPage extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.songs(null, params);
  }

  renderItems(items, more, {loading, end}) {
    if (!items) {
      return <Loader/>;
    }

    return (
      <Page>
        <MainPaginatedResults more={more}>
          <PageTitle title={"Songs"} context={"My Library"} />
          <SongList
            songs={items}
            album={false}
            showAlbum={true}
            showArtist={true}
          />
          {loading && <Loader/>}
        </MainPaginatedResults>
      </Page>
    );
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
