import React, {Fragment} from 'react';
import addImage from '../assets/Add.png';
import PageTitle from './PageTitle';
import pause from '../assets/Pause.png';
import play from '../assets/Play.png';

export default class SongList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSong: ''
    }

    this.onMediaItemDidChange = this.onMediaItemDidChange.bind(this);
  }

  onMediaItemDidChange(event) {
    console.log(event);
    this.setState({
      currentSong: event.item.id
    })
  }

  componentDidMount() {
    const music = MusicKit.getInstance();
    music.addEventListener(
      MusicKit.Events.mediaItemDidChange,
      this.onMediaItemDidChange,
    );
  }
  componentWillUnmount() {
    const music = MusicKit.getInstance();
    music.removeEventListener(
      MusicKit.Events.mediaItemDidChange,
      this.onMediaItemDidChange,
    );
  }

  render() {
    return (
        <Fragment>
          <PageTitle title={'Artists'} context={'Your Library'}/>
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
            {this.props.songs.map((song, i) => {
                const id = song.attributes.playParams.catalogId;
                return <SongListItem key={id} song={song} index={i}
                              songs={this.props.songs}
                              albumArt={!this.props.album}
                              isPlaying={id == this.state.currentSong}/>
            },
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

    this.state = {
      setQueue: false,
      isPlaying: false
    }

    this._playSong = this._playSong.bind(this);
    this._pauseSong = this._pauseSong.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  async _playSong() {
    let music = MusicKit.getInstance();
    if(!this.state.setQueue){
      await music.setQueue({
        startPosition: this.props.index,
        items: this.props.songs,
      });
      this.setState({
        setQueue: true
      });
    }
    await music.play();
    this.setState({
      isPlaying: true
    });
  }
  _pauseSong() {
    const music = MusicKit.getInstance();

    music.player.pause();
    this.setState({
      isPlaying: false
    });
  }

  _handleClick() {
    if(this.state.isPlaying){
      this._pauseSong();
    }else {
      this._playSong();
    }
  }


  getTime(ms) {
    ms = 1000 * Math.round(ms / 1000); // round to nearest second
    let d = new Date(ms);
    return d.getUTCMinutes() + ':' + String('0' + d.getUTCSeconds()).slice(-2); // gets a nice minutes and seconds formatting of the time
  }

  render() {
    const songAttributes = this.props.song.attributes;

    const SIZE = 40;
    let url = MusicKit.formatArtworkURL(songAttributes.artwork, SIZE, SIZE);
    const explicit = ''; // TODO: get if the song is explicit or not
    const inLibrary = songAttributes.playParams.isLibrary ?
        '' :
        <img src={addImage}/>; // If the song is already in the library or not

    const time = this.getTime(songAttributes.durationInMillis);
    
    const imageOrNumber = this.props.albumArt ?
        <div className={"play-overlay"}><img src={url} alt=""/></div> :
        <h3>{this.props.attributes.trackNumber}</h3>;

    return (
        <tr onClick={this._handleClick} className={`test-overlay ${this.props.isPlaying ? 'pause' : ''}`} >
          <td> {/* Song Name, icon, explicit */}
            <div>
              <div>
                {imageOrNumber}
              </div>
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
