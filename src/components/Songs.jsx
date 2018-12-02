import React from 'react';
import SongList from './SongList';
import PaginatedResults from './PaginatedResults';
import MainPaginatedResults from './MainPaginatedResults';
import PageTitle from './PageTitle';

export default class Songs extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.songs(null, params);
  }

  renderItems(items, more, {loading, end}) {
    if (!items) {
      return 'Loading...';
    }

    return (
        <MainPaginatedResults more={more}>
          <PageTitle title={"Songs"} context={"Your Library"} />
          <SongList songs={items} album={false}/>
          {loading && "Loading..."}
        </MainPaginatedResults>
    );
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
