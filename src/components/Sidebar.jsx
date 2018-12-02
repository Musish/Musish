import React from 'react';
import cx from 'classnames';
import {Link, Route} from 'react-router-dom';
import Player from './Player';

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
    if (!this.state.playlists) {
      return ""
    }

    const playlists = this.state.playlists.map((playlist, i) => <MenuItem
        to={`/playlists/${playlist.id}`}
        label={playlist.attributes.name}
        key={i}/>);

    return (
        <aside id="main-sidebar">
          <div className="menus">
            <div className="menu library">
              <h3>My Library</h3>
              <ul>
                <MenuItem to={'/playlists'} label={'Playlists'}/>
                <MenuItem to={'/artists'} label={'Artists'}/>
                <MenuItem to={'/albums'} label={'Albums'}/>
                <MenuItem to={'/songs'} label={'Songs'}/>
              </ul>
            </div>
            <div className="menu playlists">
              <h3>Playlists</h3>
              <ul>
                {playlists}
              </ul>
            </div>
          </div>
          <Player/>
        </aside>
    );
  }
}


class MenuItem extends React.Component {
  render() {
    return (
        <Route path={this.props.to} exact children={({match}) => (
            <li className={cx({active: !!match})}>
              <Link to={this.props.to}>
                {this.props.label}
              </Link>
            </li>
        )}/>
    );
  }
}
