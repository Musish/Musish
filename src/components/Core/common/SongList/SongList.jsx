import React from 'react';
import addImage from '../../../../assets/Add.png';

import classes from './SongList.scss';

export default class SongList extends React.Component {
  constructor(props) {
    super(props);

    const music = MusicKit.getInstance();
    let currentSong = null;
    if (music.player.isPlaying) {
      currentSong = music.player.nowPlayingItem.id;
    }

    this.state = {
      currentSong: currentSong,
      isPlaying: music.player.isPlaying,
    };

    this.onMediaItemDidChange = this.onMediaItemDidChange.bind(this);
    this.playbackStateDidChange = this.playbackStateDidChange.bind(this);
  }

  onMediaItemDidChange(event) {
    this.setState({
      currentSong: event.item.id
    })
  }

  playbackStateDidChange(_) {
    const music = MusicKit.getInstance();
    this.setState({
      isPlaying: music.player.isPlaying,
    });
  };

  componentDidMount() {
    const music = MusicKit.getInstance();
    music.addEventListener(
      MusicKit.Events.mediaItemDidChange,
      this.onMediaItemDidChange,
    );
    music.addEventListener(
      MusicKit.Events.playbackStateDidChange,
      this.playbackStateDidChange,
    );
  }

  componentWillUnmount() {
    const music = MusicKit.getInstance();
    music.removeEventListener(
      MusicKit.Events.mediaItemDidChange,
      this.onMediaItemDidChange,
    );
    music.removeEventListener(
      MusicKit.Events.playbackStateDidChange,
      this.playbackStateDidChange,
    );
  }

  render() {
    const {songs, album, showArtist, showAlbum} = this.props;
    const {currentSong, isPlaying} = this.state;
    return (
      <ul className={classes.songList}>
        {songs.filter(song => song.attributes.playParams && song.attributes.playParams.catalogId).map((song, i) => (
          <SongListItem
            key={i}
            song={song}
            index={i}
            songs={songs}
            albumArt={!album}
            isPlaying={song.attributes.playParams.catalogId === currentSong && isPlaying}
            showArtist={showArtist}
            showAlbum={showAlbum}
          />
        ))}
      </ul>
    );
  }
}

class SongListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      setQueue: false
    };

    const SIZE = 40;

    this.imageUrl = MusicKit.formatArtworkURL(this.props.song.attributes.artwork, SIZE, SIZE);
    this.explicit = <React.Fragment/>; // TODO: get if the song is explicit or not
    this.inLibrary = this.props.song.attributes.playParams.isLibrary
      ? <React.Fragment/>
      : <img src={addImage}/>;
    this.time = this.getTime(this.props.song.attributes.durationInMillis);
    this.imageOrNumber = this.props.albumArt ?
      <div className={"play-overlay"}><img src={this.imageUrl} alt=""/></div> :
      <div className={"play-overlay"}><h3>{this.props.song.attributes.trackNumber}</h3></div>;

    this._playSong = this._playSong.bind(this);
    this._pauseSong = this._pauseSong.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  async _playSong() {
    let music = MusicKit.getInstance();
    if (!this.state.setQueue) {
      await music.setQueue({
        startPosition: this.props.index,
        items: this.props.songs,
      });
      this.setState({
        setQueue: true
      });
    }
    await music.player.play();
  }

  async _pauseSong() {
    let music = MusicKit.getInstance();
    await music.player.pause();
  }

  async _handleClick() {
    if (this.props.isPlaying) {
      this._pauseSong();
    } else {
      this._playSong();
    }
  }


  getTime(ms) {
    ms = 1000 * Math.round(ms / 1000); // round to nearest second
    let d = new Date(ms);
    return d.getUTCMinutes() + ':' + String('0' + d.getUTCSeconds()).slice(-2); // gets a nice minutes and seconds formatting of the time
  }

  renderIcon() {
    return (
      <React.Fragment>
        {this.props.albumArt ? (
          <span className={classes.albumArtwork}>
            <span className={classes.artworkWrapper}>
            <img src={this.imageUrl} alt=""/>
            </span>
          </span>
        ) : (
          <span className={classes.songIndex}>
            {this.props.song.attributes.trackNumber}.
          </span>
        )}
      </React.Fragment>
    );
  }

  render() {
    const {isPlaying, showArtist, showAlbum} = this.props;
    const songAttributes = this.props.song.attributes;
    return (
      <li className={`${classes.song} ${isPlaying ? 'playing' : ''}`} onClick={this._handleClick}>
        {this.renderIcon()}
        <span className={classes.songInfo}>
          <span className={classes.songTitle}>
            {songAttributes.name}{this.explicit}
          </span>
          {(showArtist || showAlbum) && (
            <span className={classes.songCaption}>
              {(showArtist && showAlbum) ? (
                `${songAttributes.artistName} - ${songAttributes.albumName}`
              ) : showArtist ? (
                `${songAttributes.artistName}`
              ) : (
                `${songAttributes.albumName}`
              )}
            </span>
          )}
        </span>
        <span className={classes.songDuration}>
          <span>{this.time}</span>
        </span>
      </li>
      /*
      <tr onClick={this._handleClick} className={`test-overlay ${isPlaying ? 'pause' : ''}`}>
        <td>
          <div className={classes.songTitleWrapper}>
            <div>
              {this.imageOrNumber}
            </div>
            <div>
              <span className={classes.songName}>{songAttributes.name}</span>
              {this.explicit}
            </div>
          </div>
        </td>
        {showArtist && (
          <td>
            <span>{songAttributes.artistName}</span>
          </td>
        )}
        {(showAlbum && (
          <td>
            <div className={classes.albumName}>
              <span>{songAttributes.albumName}</span>
              <span>{this.inLibrary}</span> {/* If it is not in the users library, then it will just show an image to add to library  * /}
            </div>
          </td>
        ))}
        <td>
          <span>{this.time}</span>
        </td>
      </tr>
      */
    );
  }
}

SongList.defaultProps = {
  showArtist: false,
  showAlbum: false
};