import React from 'react';
import SongList from './SongList';

export default class Songs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const songs = await music.api.library.songs(null, {limit: 50});

    console.log(songs.length);

    this.setState({
      songs: songs,
    });

  }

  render() {
    if (!this.state.songs) {
      return 'Loading...';
    }

    return <SongList songs={this.state.songs} album={false}/>;
  }
}
