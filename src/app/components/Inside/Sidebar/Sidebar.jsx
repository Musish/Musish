import React from 'react';
import PropTypes from 'prop-types';
import Player from '../Player/Player';
import classes from './Sidebar.scss';
import PlaylistMenuItem from './PlaylistMenuItem';
import withMK from '../../../hoc/withMK';
import withContext from '../../../hoc/withContext';
import SidebarMenu from './SidebarMenu';
import SidebarLibraryMenu from './SidebarLibraryMenu';
import AuthorizeContext from '../NavigationBar/Authorize/AuthorizeContext';
import InfiniteLoader from '../../Common/InfiniteLoader/InfiniteLoader';
import PlaylistsContext from './PlaylistsContext';

class Sidebar extends React.Component {
  static async loadPlaylists(params) {
    const music = MusicKit.getInstance();

    return music.api.library.playlists(null, params);
  }

  static renderPlaylists(args, { items }) {
    return items.map(playlist => (
      <PlaylistMenuItem
        playlist={playlist}
        to={`/me/playlists/${playlist.id}`}
        label={playlist.attributes.name}
        key={playlist.id}
      />
    ));
  }

  render() {
    const { authorized } = this.props;

    const appleMusic = authorized ? (
      <SidebarMenu
        title={'Apple Music'}
        items={[
          { to: '/', label: 'For You' },
          { to: '/browse', label: 'Browse', exact: false },
          { to: '/radio', label: 'Radio' },
        ]}
      />
    ) : (
      <SidebarMenu
        title={'Apple music'}
        items={[{ to: '/browse', label: 'Browse' }, { to: '/radio', label: 'Radio' }]}
      />
    );

    return (
      <aside className={classes.sidebar}>
        <div className={classes.menus}>
          {appleMusic}
          {authorized && (
            <SidebarLibraryMenu
              title={'My Library'}
              items={[
                { to: '/me/added', label: 'Recently Added', exact: false },
                { to: '/me/artists', label: 'Artists', exact: false },
                { to: '/me/albums', label: 'Albums', exact: false },
                { to: '/me/songs', label: 'Songs' },
                { to: '/me/playlists', label: 'Playlists' },
              ]}
            />
          )}
          {authorized && (
            <div className={classes.menu}>
              <h3>Playlists</h3>
              <ul>
                <PlaylistsContext.Consumer>
                  {({ setItems }) => (
                    <InfiniteLoader
                      load={Sidebar.loadPlaylists}
                      render={Sidebar.renderPlaylists}
                      loadAll
                      onSetItems={({ items }) => setItems(items)}
                    />
                  )}
                </PlaylistsContext.Consumer>
              </ul>
            </div>
          )}
          <div className={classes.footer}>
            <span>
              <a href={'https://github.com/Musish/Musish/issues/new/choose'} target={'_blank'}>
                Feedback
              </a>
              {' & '}
              <a href={'https://github.com/Musish/Musish'} target={'_blank'}>
                Github
              </a>
            </span>
            <span className={classes.footnote}>
              {'Designed with '}
              <i className={'fa fa-heart'} />
              {' by the Musish team.'}
            </span>
          </div>
        </div>
        <Player />
      </aside>
    );
  }
}

Sidebar.propTypes = {
  authorized: PropTypes.bool.isRequired,
};

export default withMK(withContext(Sidebar, AuthorizeContext));
