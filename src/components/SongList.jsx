import React from 'react';

export default class SongList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      loaded: false
    }
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const songs = await music.api.library.songs();
    console.log(songs);


    this.setState({
      songs: songs,
      loaded: true
    });
  }

  render() {
    if(!this.state.loaded) {
      return (
        <div>
          Not yet loaded
        </div>
      );
    }

    return (
      <div className="songList">
        <ul>
          {this.state.songs.map(song => 
            <li><SongListItem key={song.id} song={song} albumArt={false} /></li>
          )}
        </ul>
      </div>
    );
  }
}

class SongListItem extends React.Component {
  
  render() {
    console.log(this.props)
    return (
      <div>
        {this.props.song.attributes.name}
      </div>
    );
  }
}