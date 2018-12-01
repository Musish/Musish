import React from 'react';
import addImage from  '../assets/Add.png';

export default class SongList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: this.props.songs !== undefined ? this.props.songs : [],
      loaded: this.props.songs !== undefined
    }
  }

  async componentDidMount() {
    if(!this.state.loaded) {
      const music = MusicKit.getInstance();
      const songs = await music.api.library.songs();
      console.log(songs);


      this.setState({
        songs: songs,
        loaded: true
      });
    }
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
            <SongListItem key={song.id} song={song} albumArt={false} />
          )}
        </tbody>
      </table>
    );
  }
}

class SongListItem extends React.Component {

  render() {
    const WHEIGHT = 50;
    let url = this.props.song.attributes.artwork.url;
          url = url.replace('{w}', WHEIGHT);
          url = url.replace('{h}', WHEIGHT);
    let explicit = null; // TODO: get if the song is explicit or not
    let inLibrary = this.props.song.attributes.playParams.isLibrary ? "" : <img src={addImage}/>;
    let ms = this.props.song.attributes.durationInMillis;
    ms = 1000*Math.round(ms/1000); // round to nearest second
    const d = new Date(ms);
    const time = d.getUTCMinutes() + ':' + String("0" + d.getUTCSeconds()).slice(-2);
    return (
      <tr>
        <td>
          <div>
            <img src={url} style={{width: WHEIGHT, height: WHEIGHT}} alt="" />
            <span>{this.props.song.attributes.name}</span>
          </div>
        </td>
        <td>
          <span>{this.props.song.attributes.artistName}</span>
        </td>
        <td>
          <span>{this.props.song.attributes.albumName}</span>
          <span>{inLibrary}</span> {/* If it is not in the users library, then it will just show an image to add to library  */}
        </td>
        <td>
          <span>{time}</span>
        </td>
      </tr>
    );
  }
}
