import React from 'react';
import styles from './Player.scss'
import {
  artworkForMediaItem,
  RepeatModeAll,
  RepeatModeNone,
  RepeatModeOne,
  ShuffleModeOff,
  ShuffleModeSongs
} from "../common/Utils";
import cx from 'classnames';
import withMK from '../../../hoc/withMK';
import Queue from "./Queue/Queue";

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isScrubbing: false,
      scrubbingPosition: 0,
      volume: 0,
    };

    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.scrubToTime = this.scrubToTime.bind(this);
    this.onStartScrubbing = this.onStartScrubbing.bind(this);
    this.onEndScrubbing = this.onEndScrubbing.bind(this);
    this.onScrub = this.onScrub.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);

    this.handleAddToLibrary = this.handleAddToLibrary.bind(this);
    this.handleRepeat = this.handleRepeat.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.getVolumeIconClasses = this.getVolumeIconClasses.bind(this);
  }

  static timeToPercent(time, duration) {
    if (duration === 0) {
      return 0; // For some reason would call this
    }

    return Math.floor((time * 100) / duration);
  }

  async scrubToTime(time) {
    await this.props.mk.instance.player.seekToTime(time);
  }

  handlePlay() {
    this.props.mk.instance.player.play();
  }

  handlePause() {
    this.props.mk.instance.player.pause();
  }

  handlePrevious() {
    const player = this.props.mk.instance.player;

    if (this.state.playbackTime < 2) {
      player.skipToPreviousItem();
    } else {
      player.seekToTime(0)
    }
  }

  handleNext() {
    const player = this.props.mk.instance.player;
    player.skipToNextItem();

    if (player.repeatMode === 1) {
      player.seekToTime(0);
    }
  }

  handleAddToLibrary() {
    console.log('Add to library');

    // this.props.mk.instance.addToLibrary();
  }

  handleRepeat() {
    const player = this.props.mk.instance.player;

    if (player.repeatMode === RepeatModeNone) {
      player.repeatMode = RepeatModeOne;
    } else if (player.repeatMode === RepeatModeOne) {
      player.repeatMode = RepeatModeAll;
    } else {
      player.repeatMode = RepeatModeNone;
    }

    this.forceUpdate()
  }

  handleShuffle() {
    const player = this.props.mk.instance.player;

    if (player.shuffleMode === ShuffleModeOff) {
      player.shuffleMode = ShuffleModeSongs;
    } else {
      player.shuffleMode = ShuffleModeOff;
    }

    this.forceUpdate()
  }

  handleVolumeChange(e) {
    this.props.mk.instance.player.volume = e.target.value;
  }

  getVolumeIconClasses() {
    const volume = this.props.mk.instance.player.volume * 100;

    if (volume === 0) {
      return 'fas fa-times';
    }

    if (volume > 0 && volume < 30) {
      return 'fas fa-volume-off';
    }

    if (volume >= 30 && volume < 60) {
      return 'fas fa-volume-down';
    }

    return 'fas fa-volume-up';
  }

  renderProgress() {
    const {mediaItem: {item: nowPlayingItem}, playbackTime} = this.props.mk;
    const duration = nowPlayingItem.playbackDuration / 1000;
    const percent = playbackTime ? Player.timeToPercent(playbackTime.currentPlaybackTime, duration) : 0;

    return (
      <input
        className={styles['progress-bar']}
        style={{backgroundSize: `${percent}% 100%`}}
        type={'range'}
        value={this.getScrubberValue()}
        onChange={this.onScrub}
        onMouseDown={this.onStartScrubbing}
        onMouseUp={this.onEndScrubbing}
        min={0}
        max={nowPlayingItem.playbackDuration}
        step={0.01}
      />
    );
  }

  onScrub(e) {
    this.setState({
      scrubbingPosition: e.target.value
    })
  }

  onStartScrubbing(e) {
    this.setState({
      isScrubbing: true,
      scrubbingPosition: e.target.value,
    })
  }

  async onEndScrubbing(e) {
    await this.scrubToTime(e.target.value / 1000);

    this.setState({
      isScrubbing: false,
      scrubbingPosition: null,
    });
  }

  getScrubberValue() {
    if (this.state.isScrubbing) {
      return this.state.scrubbingPosition;
    }

    const {playbackTime} = this.props.mk;
    if (playbackTime) {
      return playbackTime.currentPlaybackTime * 1000
    }

    return 0;
  }

  render() {
    const {mk} = this.props;
    const nowPlayingItem = mk.mediaItem && mk.mediaItem.item;

    if (!nowPlayingItem) {
      return null;
    }

    const artworkURL = artworkForMediaItem(nowPlayingItem, 40);

    const repeatMode = mk.instance.player.repeatMode;
    const shuffleMode = mk.instance.player.shuffleMode;

    const isShuffle = repeatMode === RepeatModeOne || repeatMode === RepeatModeAll;

    return (
      <div className={styles.player}>
        <div className={styles['main-info']}>
          <div className={styles.picture}>
            <img src={artworkURL} className={styles.image} alt={'album artwork'}/>
          </div>
          <div className={styles.track}>
            <h1>{nowPlayingItem.title}</h1>
            <h2>{nowPlayingItem.attributes.artistName}</h2>
            <h3>{nowPlayingItem.attributes.albumName}</h3>
          </div>
        </div>
        {this.renderProgress()}
        <div className={styles.buttons}>
          <span onClick={this.handlePrevious}>
            <i className={'fas fa-backward'}/>
          </span>
          {mk.instance.player.isPlaying ? (
            <span className={styles.main} onClick={this.handlePause}>

              <i className={"fas fa-pause"}/>
            </span>
          ) : (
            <span className={styles.main} onClick={this.handlePlay}>
              <i className={"fas fa-play"}/>
            </span>
          )}
          <span onClick={this.handleNext}>
            <i className={"fas fa-forward"}/>
          </span>
        </div>

        <div className={styles.buttons}>

          <span className={cx(styles.controls, styles.volumeControlWrapper)}>
            <i className={this.getVolumeIconClasses()}/>
            <div className={styles.volumeControlContainer}>
              <div className={styles.volumeBarWrapper}>
                <input
                  className={cx(styles['progress-bar'], styles.volumeBar)}
                  style={{backgroundSize: `${mk.instance.player.volume * 100}% 100%`}}
                  type={'range'}
                  value={mk.instance.player.volume}
                  onChange={this.handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>
          </span>

          <span
            className={cx(styles.controls, {[styles.shuffle]: isShuffle, [styles.one]: repeatMode === RepeatModeOne})}
            onClick={this.handleRepeat}
          >
            <i className={"fas fa-redo-alt"}/>
          </span>

          <span className={cx(styles.controls, {[styles.shuffle]: shuffleMode === ShuffleModeSongs})}
                onClick={this.handleShuffle}>
            <i className={"fas fa-random"}/>
          </span>

          <span className={cx(styles.controls, styles.queueWrapper)}>
            <i className={"fas fa-list-ol"}/>
            <div className={styles.queueContainer}>
              <div className={styles.queueInner}>
                <h3>Up next</h3>
                <Queue />
              </div>
            </div>
          </span>
        </div>
      </div>
    );
  }
}

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
  [MusicKit.Events.queueItemsDidChange]: 'queueItems',
  [MusicKit.Events.queuePositionDidChange]: 'queuePosition',
  [MusicKit.Events.playbackTimeDidChange]: 'playbackTime',
  [MusicKit.Events.playbackStateDidChange]: 'playbackState',
  [MusicKit.Events.playbackVolumeDidChange]: 'playbackVolume',
};

export default withMK(Player, bindings);
