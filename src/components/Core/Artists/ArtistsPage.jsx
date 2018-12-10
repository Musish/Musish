import React, { Fragment } from 'react';
import PageTitle from "../../common/PageTitle";
import PaginatedResults from '../common/PaginatedResults';
import Loader from "../../common/Loader";

import Classes from './Artists.scss';
import Page from "../Layout/Page";
import MainPaginatedResults from "../common/MainPaginatedResults";
import AlbumPanel from "../Albums/AlbumPanel";

export default class ArtistsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  setArtist(artist) {
    console.log('set', artist);
  };

  render() {
    return (
      <Fragment>
        <ArtistList setArtist={this.setArtist} />
        <Page>
          <PageTitle title={"Artists"} context={"My Library"} />
          <div className={Classes.container}>
            <AlbumPanel />
          </div>
        </Page>
      </Fragment>
    );
  }
}

class ArtistList extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();
    return await music.api.library.artists(null, params);
  }

  renderList(artists, more, {loading, end}) {
    if (!artists) {
      return <Loader/>;
    }

    const artistRows = artists && artists.map((artist) => {
      return (
        <li key={`artist-${artist.id}`}>
          <div>
            <span className={Classes.pictureWrapper}>

            </span>
          </div>
          <div>
            <span className={Classes.artistName}>
              {artist.attributes.name}
            </span>
          </div>
        </li>
      );
    });

    return (
      <ul>
        {artistRows}
      </ul>
    );
  };

  render() {
    return (
      <aside className={Classes.artistList}>
        <PaginatedResults load={this.load} render={this.renderList} />
      </aside>
    );
  }
}