import React, {Fragment} from 'react';
import addImage from  '../assets/Add.png';
import PageTitle from "./PageTitle";

export default class SongList extends React.Component {
  render() {
    return (
      <Fragment>
        <PageTitle title={"Artists"} context={"Your Library"} />
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
          {this.props.songs.map((song, i) =>
            <SongListItem key={song.id} song={song} index={i} songs={this.props.songs} albumArt={!this.props.album} />
          )}
          </tbody>
        </table>
      </Fragment>
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

    await music.setQueue({
      startPosition: this.props.index,
      items: this.props.songs,
    });
    await music.play();
  }

  getTime(ms) {
    ms = 1000*Math.round(ms/1000); // round to nearest second
    let d = new Date(ms);
    return d.getUTCMinutes() + ':' + String("0" + d.getUTCSeconds()).slice(-2); // gets a nice minutes and seconds formatting of the time
  }

  render() {
    const songAttributes = this.props.song.attributes;

    const WHEIGHT = 40;
    let url = MusicKit.formatArtworkURL(songAttributes.artwork, WHEIGHT, WHEIGHT);
    const explicit = ''; // TODO: get if the song is explicit or not
    const inLibrary = songAttributes.playParams.isLibrary ? "" : <img src={addImage}/>; // If the song is already in the library or not

    const time = this.getTime(songAttributes.durationInMillis);

    const songPre = this.props.albumArt ? <img src={url} style={{width: WHEIGHT, height: WHEIGHT}} alt="" /> : <h3>{this.props.attributes.trackNumber}</h3>

    return (
      <tr onClick={this._playSong}>
        <td> {/* Song Name, icon, explicit */}
          <div>
            {songPre}
            <span>{songAttributes.name}</span>
            {explicit}
          </div>
        </td>
        <td> {/* Artist Name */}
          <span>{songAttributes.artistName}</span>
        </td>
        <td> {/* Album Name and add to library */}
          <span>{songAttributes.albumName}</span>
          <span>{inLibrary}</span> {/* If it is not in the users library, then it will just show an image to add to library  */}
        </td>
        <td> {/* Time or menu button */}
          <span>{time}</span>
        </td>
      </tr>
    );
  }
}
