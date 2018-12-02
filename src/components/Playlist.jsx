import React from 'react';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch, withRouter,
} from 'react-router-dom';
import Albums from './Albums';
import AlbumItem from './AlbumItem';
import Layout from './Layout';
import Artists from './Artists';
import Artist from './Artist';

class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: null
    }
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const playlist = await music.api.library.playlist(this.props.match.params.id)

    console.log(playlist);

    this.setState({
      playlist
    })
  }

  render() {
    if(!this.state.playlist) {
      return "Loading..."
    }
    return (
      <div>
        {this.state.playlist.id}
      </div>
    );
  }
}

export default withRouter(Playlist);
