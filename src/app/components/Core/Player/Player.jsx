import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './Player.scss';
import {
  artworkForMediaItem,
  RepeatModeAll,
  RepeatModeNone,
  RepeatModeOne,
  getTime,
} from '../../../utils/Utils';
import withMK from '../../../hoc/withMK';
import QueueContext from './Queue/QueueContext';
import LyricsModalContext from './Lyrics/LyricsModalContext';
import {
  isShuffled,
  pause,
  play,
  seekToTime,
  shuffle,
  unShuffle,
} from '../../../services/MusicPlayerApi';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isScrubbing: false,
      scrubbingPosition: 0,
    };

    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.onStartScrubbing = this.onStartScrubbing.bind(this);
    this.onEndScrubbing = this.onEndScrubbing.bind(this);
    this.onScrub = this.onScrub.bind(this);

    this.handleAddToLibrary = this.handleAddToLibrary.bind(this);
    this.handleRepeat = this.handleRepeat.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
    this.getVolumeIconClasses = this.getVolumeIconClasses.bind(this);

    this.getCurrentPlaybackDuration = this.getCurrentPlaybackDuration.bind(this);
    this.getCurrentPlaybackTime = this.getCurrentPlaybackTime.bind(this);
    this.getCurrentBufferedProgress = this.getCurrentBufferedProgress.bind(this);
  }

  static timeToPercent(time, duration) {
    if (duration === 0) {
      return 0; // For some reason would call this
    }

    return Math.floor((time * 100) / duration);
  }

  handlePrevious() {
    const { player } = this.props.mk.instance;
    const { playbackTime } = this.props.mk;

    if (playbackTime.currentPlaybackTime < 2) {
      player.skipToPreviousItem();
    } else {
      player.seekToTime(0);
    }
  }

  handleNext() {
    const { player } = this.props.mk.instance;
    player.skipToNextItem();

    if (player.repeatMode === 1) {
      player.seekToTime(0);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleAddToLibrary() {
    // console.log('Add to library');
    // this.props.mk.instance.addToLibrary();
  }

  handleRepeat() {
    const { player } = this.props.mk.instance;

    if (player.repeatMode === RepeatModeNone) {
      player.repeatMode = RepeatModeOne;
    } else if (player.repeatMode === RepeatModeOne) {
      player.repeatMode = RepeatModeAll;
    } else {
      player.repeatMode = RepeatModeNone;
    }

    this.forceUpdate();
  }

  async handleShuffle() {
    if (isShuffled()) {
      await unShuffle();
    } else {
      await shuffle();
    }

    this.forceUpdate();
  }

  handleVolumeChange(e) {
    this.props.mk.instance.player.volume = e.target.value;
  }

  toggleVolume() {
    const { player } = this.props.mk.instance;
    player.volume = player.volume <= 0.5 ? 1 : 0;
  }

  getVolumeIconClasses() {
    const { volume } = this.props.mk.instance.player;

    if (volume === 0) {
      return 'fas fa-times';
    }

    if (volume < 0.3) {
      return 'fas fa-volume-off';
    }

    if (volume < 0.6) {
      return 'fas fa-volume-down';
    }

    return 'fas fa-volume-up';
  }

  getCurrentPlaybackDuration() {
    const { player } = this.props.mk.instance;
    return getTime(player.currentPlaybackTimeRemaining * 1000);
  }

  getCurrentPlaybackTime() {
    const { player } = this.props.mk.instance;
    return getTime(player.currentPlaybackTime * 1000);
  }

  getCurrentBufferedProgress() {
    const { player } = this.props.mk.instance;
    return player.currentBufferedProgress;
  }

  renderProgress() {
    const {
      mediaItem: { item: nowPlayingItem },
      playbackTime,
    } = this.props.mk;
    const duration = this.props.mk.instance.isAuthorized
      ? nowPlayingItem.playbackDuration / 1000
      : 30;
    const percent = playbackTime
      ? Player.timeToPercent(playbackTime.currentPlaybackTime, duration)
      : 0;
    const bufferPercent = playbackTime ? this.getCurrentBufferedProgress() : 0;

    return (
      <input
        className={styles['progress-bar']}
        style={{
          background: `linear-gradient(
            to right,
            #fe2851 0%,
            #fe2851 ${percent}%,
            #cccccc ${percent}%,
            #cccccc ${bufferPercent}%,
            #eeeeee ${bufferPercent}%,
            #eeeeee 100%
          ) no-repeat`,
        }}
        type={'range'}
        value={this.getScrubberValue()}
        onChange={this.onScrub}
        onMouseDown={this.onStartScrubbing}
        onMouseUp={this.onEndScrubbing}
        min={0}
        max={duration}
        step={1}
      />
    );
  }

  onScrub(e) {
    this.setState({
      scrubbingPosition: e.target.value,
    });
  }

  onStartScrubbing(e) {
    this.setState({
      isScrubbing: true,
      scrubbingPosition: e.target.value,
    });
  }

  async onEndScrubbing(e) {
    await seekToTime(e.target.value);

    this.setState({
      isScrubbing: false,
      scrubbingPosition: null,
    });
  }

  getScrubberValue() {
    if (this.state.isScrubbing) {
      return this.state.scrubbingPosition;
    }

    const { playbackTime } = this.props.mk;
    if (playbackTime) {
      return playbackTime.currentPlaybackTime;
    }

    return 0;
  }

  render() {
    const { mk } = this.props;
    const nowPlayingItem = mk.mediaItem && mk.mediaItem.item;

    if (!nowPlayingItem) {
      return null;
    }

    const artworkURL = artworkForMediaItem(nowPlayingItem, 60);

    const { repeatMode } = mk.instance.player;

    const isRepeating = repeatMode === RepeatModeOne || repeatMode === RepeatModeAll;

    return (
      <div className={styles.player}>
        <div className={styles['main-info']}>
          <div className={styles.picture}>
            <img src={artworkURL} className={styles.image} alt={'album artwork'} />
          </div>
          <div className={styles.track}>
            <h1>{nowPlayingItem.title}</h1>
            <h2>{nowPlayingItem.attributes.artistName}</h2>
            <h3>{nowPlayingItem.attributes.albumName}</h3>
          </div>
        </div>
        <div className={styles.progressBarWrapper}>
          <span className={styles.playbackTime}>{this.getCurrentPlaybackTime()}</span>
          {this.renderProgress()}
          <span className={styles.playbackDuration}>{this.getCurrentPlaybackDuration()}</span>
        </div>
        <div className={styles.buttons}>
          <span onClick={this.handlePrevious}>
            <i className={'fas fa-backward'} />
          </span>
          {mk.instance.player.isPlaying ? (
            <span className={styles.main} onClick={pause}>
              <i className={'fas fa-pause'} />
            </span>
          ) : (
            <span className={styles.main} onClick={play}>
              <i className={'fas fa-play'} />
            </span>
          )}
          <span onClick={this.handleNext}>
            <i className={'fas fa-forward'} />
          </span>
        </div>

        <div className={styles.buttons}>
          <span className={cx(styles.controls, styles.volumeControlWrapper)}>
            <i className={this.getVolumeIconClasses()} onClick={this.toggleVolume} />
            <div className={styles.volumeControlContainer}>
              <div className={styles.volumeBarWrapper}>
                <input
                  className={cx(styles['progress-bar'], styles.volumeBar)}
                  style={{
                    background: `linear-gradient(
                      to right,
                      #fe2851 0%,
                      #fe2851 ${mk.instance.player.volume * 100}%,
                      #cccccc ${mk.instance.player.volume * 100}%,
                      #cccccc 100%
                    ) no-repeat`,
                  }}
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
            className={cx(styles.controls, styles.shuffle, {
              [styles.enabled]: isRepeating,
              [styles.one]: repeatMode === RepeatModeOne,
            })}
            onClick={this.handleRepeat}
          >
            <i className={'fas fa-redo-alt'} />
          </span>

          <span
            className={cx(styles.controls, { [styles.enabled]: isShuffled() })}
            onClick={this.handleShuffle}
          >
            <i className={'fas fa-random'} />
          </span>

          <LyricsModalContext.Consumer>
            {({ open }) => (
              <span className={cx(styles.controls)} onClick={() => open(nowPlayingItem)}>
                <i className={'fas fa-align-left'} />
              </span>
            )}
          </LyricsModalContext.Consumer>

          <QueueContext.Consumer>
            {({ show, doShow, doHide }) => (
              <span
                className={cx(styles.controls, { [styles.enabled]: show })}
                onClick={show ? doHide : doShow}
              >
                <i className={'fas fa-list-ol'} />
              </span>
            )}
          </QueueContext.Consumer>
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

Player.propTypes = {
  mk: PropTypes.any.isRequired,
};

export default withMK(Player, bindings);
