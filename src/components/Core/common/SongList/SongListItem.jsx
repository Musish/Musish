import React from 'react';

import {artworkForMediaItem, createMediaItem} from "../Utils";
import classes from "./SongList.scss";
import {ContextMenuTrigger} from "react-contextmenu";
import PropTypes from 'prop-types';
import {MENU_TYPE} from "./SongList";

function collect(props, {props: song, _playSong, _queueNext, _queueLater, state: {artworkURL}}) {
  return {
    ...props,
    song,
    _playSong,
    _queueNext,
    _queueLater,
    artworkURL,
  }
}

export default class SongListItem extends React.Component {
  constructor(props) {
    super(props);

    const artworkURL = artworkForMediaItem(this.props.song, 40);

    this.state = {
      artworkURL: artworkURL,
    };

    this.explicit = <></>; // TODO: get if the song is explicit or not

    this._playSong = this._playSong.bind(this);
    this._pauseSong = this._pauseSong.bind(this);
    this._queueNext = this._queueNext.bind(this);
    this._queueLater = this._queueLater.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  async _playSong() {
    let music = MusicKit.getInstance();
    await music.setQueue({
      startPosition: this.props.index,
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
    const {showAlbum, song, isPlaying} = this.props;
    return (
      <>
        {showAlbum ? (
          <span className={classes.albumArtwork}>
            {isPlaying && (
              <div className={classes.playingAnimation}>
                <div><span/><span/><span/><span/><span/></div>
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
                <div><span/><span/><span/><span/><span/></div>
              </div>
            ) : (
              <>
                {song.attributes.trackNumber}.
              </>
            )}
          </span>
        )}
      </>
    );
  }

  render() {
    const {isPlaying, showArtist, showAlbum} = this.props;
    const attributes = this.props.song.attributes;
    const inLibrary = attributes.playParams && attributes.playParams.isLibrary;
    const duration = this.getTime(attributes.durationInMillis);

    return (
      <div className={`${classes.song} ${isPlaying ? 'playing' : ''}`}
           onClick={this._handleClick}
           style={this.props.style}>
        <ContextMenuTrigger id={MENU_TYPE} attributes={{className: [classes.songWrapper]}}
                            collect={props => collect(props, this)}>
          <div className={classes.songBacker}/>
          {this.renderIcon()}
          <div className={classes.songInfo}>
              <span className={classes.songTitle}>
                {attributes.name}{this.explicit}
              </span>
            {(showArtist || showAlbum) && (
              <span className={classes.songCaption}>
                    {(showArtist && showAlbum) ? (
                      `${attributes.artistName} - ${attributes.albumName}`
                    ) : showArtist ? (
                      `${attributes.artistName}`
                    ) : (
                      `${attributes.albumName}`
                    )}
                  </span>
            )}
          </div>
          <span className={classes.songDuration}>
            <span>{duration}</span>
          </span>
        </ContextMenuTrigger>
      </div>
    );
  }
}

SongListItem.propTypes = {
  song: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  songs: PropTypes.array.isRequired,
  albumArt: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  showArtist: PropTypes.bool.isRequired,
  showAlbum: PropTypes.bool.isRequired,
};
