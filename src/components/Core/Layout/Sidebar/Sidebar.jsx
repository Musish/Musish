import React from 'react';
import cx from 'classnames';
import {Link, Route} from 'react-router-dom';
import Player from '../../Player/Player';
import classes from './Sidebar.scss';

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
    const playlists = this.state.playlists && this.state.playlists.map((playlist, i) => (
      <MenuItem
        to={`/playlists/${playlist.id}`}
        label={playlist.attributes.name}
        key={i}
      />
    ));

    return (
      <aside className={classes.sidebar}>
        <div className={classes.menus}>
          <div className={classes.menu}>
            <h3>My Library</h3>
            <ul>
              <MenuItem to={'/'} label={'Overview'}/>
              <MenuItem to={'/artists'} exact={false} label={'Artists'}/>
              <MenuItem to={'/albums'} exact={false} label={'Albums'}/>
              <MenuItem to={'/songs'} label={'Songs'}/>
            </ul>
          </div>
          <div className={classes.menu}>
            <h3>Apple Music</h3>
            <ul>
              <MenuItem to={'/browse'} label={'Browse'}/>
              <MenuItem to={'/foryou'} label={'For You'}/>
              <MenuItem to={'/radio'} label={'Radio'}/>
            </ul>
          </div>
          {playlists && (
            <div className={classes.menu}>
              <h3>Playlists</h3>
              <ul>
                {playlists}
              </ul>
            </div>
          )}
        </div>
        <Player/>
      </aside>
    );
  }
}

class MenuItem extends React.Component {
  render() {
    const {to, label, exact = true} = this.props;

    return (
      <Route path={to} exact={exact} children={({match}) => (
        <li className={!!match ? classes.active : ''}>
          <Link to={to}>
            {label}
          </Link>
        </li>
      )}/>
    );
  }
}
