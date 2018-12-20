import React from 'react';
import { Link, Route } from 'react-router-dom';
import cx from 'classnames';

import InfiniteScroll from '../common/InfiniteScroll';
import classes from './Artists.scss';
import ArtistAlbums from './ArtistAlbums';

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
