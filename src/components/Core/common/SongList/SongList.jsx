import React, {Fragment} from 'react';
import addImage from '../../../../assets/Add.png';

import classes from './SongList.scss';
import {artworkForMediaItem, createMediaItem} from "../Utils";
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";

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

    const artworkURL = artworkForMediaItem(this.props.song, 40);

    this.state = {
      artworkURL: artworkURL,
    };

    this.explicit = <React.Fragment/>; // TODO: get if the song is explicit or not

    this._playSong = this._playSong.bind(this);
    this._pauseSong = this._pauseSong.bind(this);
    this._queueNext = this._queueNext.bind(this);
    this._queueLater = this._queueLater.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  async _playSong() {
    let music = MusicKit.getInstance();
    await music.setQueue({
      startPosition: this.props.songs.indexOf(this.props.song),
      items: this.props.songs.map(song => createMediaItem(song)),
    });
    await music.player.play();
  }

  async _pauseSong() {
    let music = MusicKit.getInstance();
    await music.player.pause();
  }

  async _queueNext() {
    let music = MusicKit.getInstance();
    await music.player.queue.prepend({items: [createMediaItem(this.props.song)]});
  }

  async _queueLater() {
    let music = MusicKit.getInstance();
    await music.player.queue.append({items: [createMediaItem(this.props.song)]});
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
    const {albumArt, song, isPlaying} = this.props;
    return (
      <React.Fragment>
        {albumArt ? (
          <span className={classes.albumArtwork}>
            {isPlaying && (
              <div className={classes.playingAnimation}>
                <div><span /><span /><span /><span /><span /></div>
              </div>
            )}
            <span className={classes.artworkWrapper}>
              <img src={this.state.artworkURL} alt=""/>
            </span>
          </span>
        ) : (
          <span className={classes.songIndex}>
            {isPlaying ? (
              <div className={classes.playingAnimation}>
                <div><span /><span /><span /><span /><span /></div>
              </div>
            ) : (
              <Fragment>
                {song.attributes.trackNumber}.
              </Fragment>
            )}
          </span>
        )}
      </React.Fragment>
    );
  }

  render() {
    const {isPlaying, showArtist, showAlbum, albumArt} = this.props;
    const songAttributes = this.props.song.attributes;
    const inLibrary = this.props.song.attributes.playParams.isLibrary;
    const duration = this.getTime(this.props.song.attributes.durationInMillis);
    return (
      <li className={`${classes.song} ${isPlaying ? 'playing' : ''}`} onClick={this._handleClick}>
        <ContextMenuTrigger id={`song-list-item-${this.props.index}`} attributes={{className: [classes.songWrapper]}}>
        <div className={classes.songBacker} />
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
          <span>{duration}</span>
        </span>
        </ContextMenuTrigger>
        <ContextMenu id={`song-list-item-${this.props.index}`}>
          <div className={"item-info"}>
            <div className={"artwork"}>
              <div className={"artwork-wrapper"}>
                <img src={this.state.artworkURL} />
              </div>
            </div>
            <div className={"description"}>
              <h1>{songAttributes.name}</h1>
              <h2>{songAttributes.artistName}</h2>
              <h3>{songAttributes.albumName}</h3>
            </div>
          </div>
          <MenuItem divider />
          <MenuItem onClick={this._playSong}>
            Play
          </MenuItem>
          <MenuItem onClick={this._queueNext}>
            Play next
          </MenuItem>
          <MenuItem onClick={this._queueLater}>
            Play later
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={this._queueLater}>
            Show Artist
          </MenuItem>
          <MenuItem onClick={this._queueLater}>
            Show Album
          </MenuItem>
          {!inLibrary && (
            <Fragment>
              <MenuItem divider/>
              <MenuItem onClick={this._queueLater}>
                Add to library
              </MenuItem>
            </Fragment>
          )}
        </ContextMenu>
      </li>
    );
  }
}

SongList.defaultProps = {
  showArtist: false,
  showAlbum: false
};