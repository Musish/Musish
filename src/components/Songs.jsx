import React from 'react';
import SongList from './SongList';
import PaginatedResults from './PaginatedResults';
import MainPaginatedResults from './MainPaginatedResults';
import Loader from './common/Loader';

export default class Songs extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.songs(null, params);
  }

  renderItems(items, more, {loading, end}) {
    if (!items) {
      return <Loader/>;
    }

    return (
        <MainPaginatedResults more={more}>
          <SongList songs={items} album={false}/>
          {loading && <Loader/>}
        </MainPaginatedResults>
    );
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
