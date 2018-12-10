import React, { Fragment } from 'react';
import PageTitle from "../../common/PageTitle";
import PaginatedResults from '../common/PaginatedResults';
import Loader from "../../common/Loader";

import Classes from './Artists.scss';
import Page from "../Layout/Page";
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
            <ArtistAlbums id={"r.5oXQex9"}/>
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

class ArtistAlbums extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const artist = await music.api.library.artist(this.props.id, {include: 'albums'});

    console.log(artist);

    this.setState({
      artist,
    });
  }

  render() {
    const {artist} = this.state;
    if (!artist) {
      return <Loader />;
    }
    console.log(artist);
    return (
      <Page>
        <PageTitle title={this.state.artist.attributes.name} context={"My Library"}/>
        {artist.relationships.albums.data.map(album => {
          return (
            <AlbumPanel album={album} />
          );
        })}
      </Page>
    );
  }
}