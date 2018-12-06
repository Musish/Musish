import React, {Fragment} from 'react';

import PlaylistItem from './PlaylistItem';

import PlaylistScss from './Playlists.scss';
import PageTitle from "../../common/PageTitle";
import PaginatedResults from '../common/PaginatedResults';
import MainPaginatedResults from '../common/MainPaginatedResults';
import Page from "../Layout/Page";

export default class PlaylistsPage extends React.Component {
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
                <PlaylistItem url={url} id={playlist.id} title={playlist.attributes.name} name={playlist.attributes.artistName}/>
              </div>
          );
        });

    return (
      <Page>
        <MainPaginatedResults more={more}>
          <PageTitle title={"Playlists"} context={"My Library"} />
          <div className={PlaylistScss.container}>
            { playlists }
          </div>
          {loading && "Loading..."}
        </MainPaginatedResults>
      </Page>
    )
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
