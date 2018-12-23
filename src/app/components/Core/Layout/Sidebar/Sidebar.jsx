import React from 'react';
import Player from '../../Player/Player';
import classes from './Sidebar.scss';
import PlaylistMenuItem from './PlaylistMenuItem';
import SidebarMenu from './SidebarMenu';
import SidebarLibraryMenu from './SidebarLibraryMenu';

export default class Sidebar extends React.Component {
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
      this.state.playlists &&
      this.state.playlists.map(playlist => (
        <PlaylistMenuItem
          playlist={playlist}
          to={`/playlists/${playlist.id}`}
          label={playlist.attributes.name}
          key={playlist.id}
        />
      ));

    return (
      <aside className={classes.sidebar}>
        <div className={classes.menus}>
          <SidebarMenu
            title={'Apple music'}
            items={[
              { to: '/', label: 'For You' },
              { to: '/browse', label: 'Browse' },
              { to: '/radio', label: 'Radio' },
            ]}
          />
          <SidebarLibraryMenu
            title={'My Library'}
            items={[
              { to: '/artists', label: 'Artists' },
              { to: '/albums', label: 'Albums' },
              { to: '/songs', label: 'Songs' },
            ]}
          />
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
