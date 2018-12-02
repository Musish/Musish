import React, {Fragment} from 'react';

import PlaylistItem from './PlaylistItem';

import PlaylistScss from './Playlists.scss';
import PageTitle from "./PageTitle";
import PaginatedResults from './PaginatedResults';
import MainPaginatedResults from './MainPaginatedResults';

export default class Playlists extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.playlists(null, params);
  }

  renderItems(items, more, {loading, end}) {
    if (!items) {
      return 'Loading...';
    }

    const playlists = items.map(
        (playlist, i) => {
          const WHEIGHT = 150;
          let url = MusicKit.formatArtworkURL(playlist.attributes.artwork, WHEIGHT, WHEIGHT);

          return (
              <div key={i}>
                <PlaylistItem url={url} title={playlist.attributes.name} name={playlist.attributes.artistName}/>
              </div>
          );
        });

    return (
        <MainPaginatedResults more={more}>
          <PageTitle title={"Playlists"} context={"Your Library"} />
          <div className={PlaylistScss.container}>
            { playlists }
          </div>
          {loading && "Loading..."}
        </MainPaginatedResults>
    )
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
