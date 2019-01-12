import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classes from './Artists.scss';
import InfiniteScroll from '../common/InfiniteScroll';

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
    const path = `/library/artists/${artist.id}`;
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
            load={ArtistsList.load}
            rowRenderer={ArtistsList.rowRenderer}
            onSetItems={({ items }) => {
              const { pathname } = this.props.location;

              if (pathname === `/library/artists` && items.length > 0) {
                this.props.history.push(`/library/artists/${items[0].id}`);
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
