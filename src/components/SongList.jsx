import React from 'react';
import addImage from  '../assets/Add.png';

export default class SongList extends React.Component {
  // Props can have album=true which will just change the icon to the track number instead
  constructor(props) {
    super(props);

    this.state = {
      songs: this.props.songs !== undefined ? this.props.songs : [],
      loaded: this.props.songs !== undefined,
      album: this.props.album !== undefined ? this.props.album : false
    }
  }

  async componentDidMount() {
    if(!this.state.loaded) {
      const music = MusicKit.getInstance();
      const songs = await music.api.library.songs();
      console.log(songs);
      let player = music.player;
      console.log(player);


      this.setState({
        songs: songs,
        loaded: true,
        album: false
      });
    }
  }

  render() {
    if(!this.state.loaded) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    return (
      <table className="songList">
        <thead>
          <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {this.state.songs.map(song => 
            <SongListItem key={song.id} song={song} albumArt={!this.state.album} />
          )}
        </tbody>
      </table>
    );
  }
}

class SongListItem extends React.Component {
  constructor(props) {
    super(props);
    
    this._playSong = this._playSong.bind(this);
  }

  async _playSong() {
    let music = MusicKit.getInstance();
    let song = this.props.song.attributes.playParams
    await music.setQueue({
      'song': song.id
    });
    await music.play();
  }

  getTime(ms) {
    ms = 1000*Math.round(ms/1000); // round to nearest second
    let d = new Date(ms);
    return d.getUTCMinutes() + ':' + String("0" + d.getUTCSeconds()).slice(-2); // gets a nice minutes and seconds formatting of the time
  }
  
  render() {
    const WHEIGHT = 50;
    let url = MusicKit.formatArtworkURL(this.props.song.attributes.artwork, WHEIGHT, WHEIGHT);
    const explicit = ''; // TODO: get if the song is explicit or not
    const inLibrary = this.props.song.attributes.playParams.isLibrary ? "" : <img src={addImage}/>; // If the song is already in the library or not
    
    const time = this.getTime(this.props.song.attributes.durationInMillis);

    const songPre = this.props.albumArt ? <img src={url} style={{width: WHEIGHT, height: WHEIGHT}} alt="" /> : <h3>{this.props.attributes.trackNumber}</h3>

    return (
      <tr onClick={this._playSong}>
        <td> {/* Song Name, icon, explicit */}
          <div>
            {songPre}
            <span>{this.props.song.attributes.name}</span>
            {explicit}
          </div>
        </td>
        <td> {/* Artist Name */}
          <span>{this.props.song.attributes.artistName}</span>
        </td>
        <td> {/* Album Name and add to library */}
          <span>{this.props.song.attributes.albumName}</span>
          <span>{inLibrary}</span> {/* If it is not in the users library, then it will just show an image to add to library  */}
        </td>
        <td> {/* Time or menu button */}
          <span>{time}</span>
        </td>
      </tr>
    );
  }
}
