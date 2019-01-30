import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classes from './ArtistsPage.scss';
import InfiniteScroll from '../../../../Common/InfiniteLoader/InfiniteScroll';

class ArtistsList extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  static async load(params) {
    const music = MusicKit.getInstance();

    return music.api.library.artists(null, params);
  }

  static rowRenderer({ item: artist, index, isScrolling, isVisible, key, style }) {
    const path = `/me/artists/${artist.id}`;
    const initials = artist.attributes.name
      .split(' ')
      .map(n => n.substring(0, 1))
      .filter(c => !/[^a-zA-Z0-9]/.test(c))
      .slice(0, 2);
    return (
      <li key={key} style={style}>
        <Route path={path} exact>
          {({ match }) => (
            <Link to={path} className={cx(classes.artist, match ? classes.activeArtist : null)}>
              <div className={classes.artistBacker} />
              <div>
                <span className={classes.pictureWrapper}>
                  <span>{initials}</span>
                </span>
              </div>
              <div>
                <div className={classes.artistName}>{artist.attributes.name}</div>
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
            load={ArtistsList.load}
            rowRenderer={ArtistsList.rowRenderer}
            onSetItems={({ items }) => {
              const { pathname } = this.props.location;

              if (pathname === `/me/artists` && items.length > 0) {
                this.props.history.push(`/me/artists/${items[0].id}`);
              }
            }}
          />
        </ul>
      </aside>
    );
  }
}

ArtistsList.propTypes = {
  history: PropTypes.any.isRequired,
  location: PropTypes.any.isRequired,
};

export default withRouter(ArtistsList);
