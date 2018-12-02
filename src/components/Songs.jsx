import React from 'react';
import SongList from './SongList';
import PaginatedResults from './PaginatedResults';

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
        <React.Fragment>
          <SongList songs={items} album={false}/>
          {loading ? "Loading..." : (!end && <div onClick={more}>Load more</div>)}
        </React.Fragment>
    );
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
