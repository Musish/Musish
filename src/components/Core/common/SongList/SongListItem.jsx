import React from 'react';

import {artworkForMediaItem, createMediaItem} from "../Utils";
import classes from "./SongList.scss";
import {ContextMenuTrigger} from "react-contextmenu";
import PropTypes from 'prop-types';
import {MENU_TYPE} from "./SongList";
import cx from 'classnames';
import withMK from "../../../../hoc/withMK";

function collect(props, {props: song, playSong, queueNext, queueLater, state: {artworkURL}}) {
  return {
    ...props,
    song,
    playSong,
    queueNext,
    queueLater,
    artworkURL,
  }
}

class SongListItem extends React.Component {
  constructor(props) {
    super(props);

    const artworkURL = artworkForMediaItem(this.props.song, 40);

    this.state = {
      artworkURL: artworkURL,
    };

    this.playSong = this.playSong.bind(this);
    this.pauseSong = this.pauseSong.bind(this);
    this.queueNext = this.queueNext.bind(this);
    this.queueLater = this.queueLater.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async playSong() {
    let music = this.props.mk.instance;
    await music.setQueue({
      startPosition: this.props.index,
      items: this.props.songs.map(song => createMediaItem(song)),
    });
    await music.player.play();
  }

  async pauseSong() {
    await this.props.mk.instance.player.pause();
  }

  async queueNext() {
    await this.props.mk.instance.player.queue.prepend({items: [createMediaItem(this.props.song)]});
  }

  async queueLater() {
    await this.props.mk.instance.player.queue.append({items: [createMediaItem(this.props.song)]});
  }

  async handleClick() {
    if (this.props.isPlaying) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  getTime(ms) {
    const s = 1000 * Math.round(ms / 1000);
    let d = new Date(s);

    return d.getUTCMinutes() + ':' + String('0' + d.getUTCSeconds()).slice(-2);
  }

  isCurrentItem() {
    const {song, mk: {mediaItem}} = this.props;

    if (!mediaItem || !mediaItem.item) {
      return false;
    }

    if (song.id == mediaItem.item.id) {
      return true;
    }

    const {playParams} = song.attributes;

    if (!playParams) {
      return false;
    }

    return playParams.catalogId == mediaItem.item.id
  }

  isPlaying() {
    return this.isCurrentItem() && this.props.mk.instance.player.isPlaying;
  }

  renderIcon() {
    const {showAlbum, song} = this.props;
    const isCurrentItem = this.isCurrentItem();

    const playingAnimation = (
      <div className={cx(classes.playingAnimation, {[classes.animated]: this.isPlaying()})}>
        <div><span/><span/><span/><span/><span/></div>
      </div>
    );

    return (
      <>
        {showAlbum ? (
          <span className={classes.albumArtwork}>
            {isCurrentItem && playingAnimation}
            <span className={classes.artworkWrapper}>
              <img src={this.state.artworkURL} alt=""/>
            </span>
          </span>
        ) : (
          <span className={classes.songIndex}>
            {isCurrentItem ? playingAnimation : song.attributes.trackNumber}
          </span>
        )}
      </>
    );
  }

  render() {
    const {showArtist, showAlbum, song} = this.props;
    const {attributes} = song;
    const inLibrary = attributes.playParams && attributes.playParams.isLibrary;
    const duration = this.getTime(attributes.durationInMillis);

    const explicit = <></>; // TODO: get if the song is explicit or not

    return (
      <div className={`${classes.song} ${this.isPlaying() ? 'playing' : ''}`}
           onClick={this.handleClick}
           style={this.props.style}>
        <ContextMenuTrigger id={MENU_TYPE}
                            attributes={{className: [classes.songWrapper]}}
                            collect={props => collect(props, this)}>
          <div className={classes.songBacker}/>
          {this.renderIcon()}
          <div className={classes.songInfo}>
            <span className={classes.songTitle}>
              {attributes.name}{explicit}
            </span>
            {(showArtist || showAlbum) && (
              <span>
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
  showArtist: PropTypes.bool.isRequired,
  showAlbum: PropTypes.bool.isRequired,
};

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
  [MusicKit.Events.playbackStateDidChange]: 'playbackState',
};

export default withMK(SongListItem, bindings);
