import React from 'react';
import PropTypes from 'prop-types';
import Player from '../../Player/Player';
import classes from './Sidebar.scss';
import MenuItem from './MenuItem';
import PlaylistMenuItem from './PlaylistMenuItem';
import withMK from '../../../../hoc/withMK';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const playlists = await music.api.library.playlists();

    this.setState({
      playlists,
    });
  }

  render() {
    const playlists =
      this.props.mk.instance.isAuthorized &&
      this.state.playlists &&
      this.state.playlists.map(playlist => (
        <PlaylistMenuItem
          playlist={playlist}
          to={`/playlists/${playlist.id}`}
          label={playlist.attributes.name}
          key={playlist.id}
        />
      ));
    const library = this.props.mk.instance.isAuthorized ? (
      <div className={classes.menu}>
        <h3>My Library</h3>
        <ul>
          <MenuItem to={'/'} label={'For You'} />
          <MenuItem to={'/artists'} exact={false} label={'Artists'} />
          <MenuItem to={'/albums'} exact={false} label={'Albums'} />
          <MenuItem to={'/songs'} label={'Songs'} />
        </ul>
      </div>
    ) : (
      <></>
    );

    return (
      <aside className={classes.sidebar}>
        <div className={classes.menus}>
          {library}
          <div className={classes.menu}>
            <h3>Apple Music</h3>
            <ul>
              <MenuItem to={'/browse'} label={'Browse'} />
              <MenuItem to={'/radio'} label={'Radio'} />
            </ul>
          </div>
          {playlists && (
            <div className={classes.menu}>
              <h3>Playlists</h3>
              <ul>{playlists}</ul>
            </div>
          )}
        </div>
        <Player />
      </aside>
    );
  }
}

Sidebar.propTypes = {
  mk: PropTypes.any.isRequired,
};

const bindings = {
  [MusicKit.Events.authorizationStatusDidChange]: 'authorization',
};

export default withMK(Sidebar, bindings);
