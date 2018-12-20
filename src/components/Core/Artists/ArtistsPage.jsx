import React from 'react';
import { Link, Route } from 'react-router-dom';
import cx from 'classnames';

import PageTitle from '../../common/PageTitle';
import InfiniteScroll from '../common/InfiniteScroll';
import Loader from '../../common/Loader';
import classes from './Artists.scss';
import PageContent from '../Layout/PageContent';
import AlbumPanel from '../Albums/AlbumPanel';

export default function ArtistsPage() {
  return (
    <>
      <ArtistList />
      <Route
        path={'/artists/:id'}
        exact
        render={({
          match: {
            params: { id },
          },
        }) => <ArtistAlbums key={id} id={id} />}
      />
    </>
  );
}

class ArtistList extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  static async load(params) {
    const music = MusicKit.getInstance();

    return music.api.library.artists(null, params);
  }

  static rowRenderer({ item: artist, index, isScrolling, isVisible, key, style }) {
    const path = `/artists/${artist.id}`;
    return (
      <li key={key} style={style}>
        <Route path={path} exact>
          {({ match }) => (
            <Link to={path} className={cx(classes.artist, match ? classes.activeArtist : null)}>
              <div className={classes.artistBacker} />
              <div>
                <span className={classes.pictureWrapper} />
              </div>
              <div>
                <span className={classes.artistName}>{artist.attributes.name}</span>
              </div>
            </Link>
          )}
        </Route>
      </li>
    );
  }

  render() {
    return (
      <aside className={classes.artistList} ref={this.ref}>
        <ul>
          <InfiniteScroll
            scrollElement={this.ref}
            rowHeight={60}
            load={ArtistList.load}
            rowRenderer={ArtistList.rowRenderer}
          />
        </ul>
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

    const { id } = this.props;
    const isCatalog = /^\d+$/.test(id);

    let artist;
    if (isCatalog) {
      artist = await music.api.artist(this.props.id, { include: 'albums' });
    } else {
      artist = await music.api.library.artist(this.props.id, { include: 'albums' });
    }

    this.setState({
      artist,
    });
  }

  renderArtists() {
    const { artist } = this.state;

    return artist.relationships.albums.data.map(album => (
      <AlbumPanel key={album.id} album={album} />
    ));
  }

  renderContent() {
    const { artist } = this.state;

    if (!artist) {
      return <Loader />;
    }

    return (
      <>
        <PageTitle title={artist.attributes.name} context={'My Library'} />
        {this.renderArtists()}
      </>
    );
  }

  render() {
    return <PageContent>{this.renderContent()}</PageContent>;
  }
}
