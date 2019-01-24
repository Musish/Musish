import React from 'react';
import PropTypes from 'prop-types';
import styles from './Player.scss';
import { getTime } from '../../../utils/Utils';
import withMK from '../../../hoc/withMK';
import { seekToTime } from '../../../services/MusicPlayerApi';

class PlayerTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isScrubbing: false,
      scrubbingPosition: 0,
    };

    this.onStartScrubbing = this.onStartScrubbing.bind(this);
    this.onEndScrubbing = this.onEndScrubbing.bind(this);
    this.onScrub = this.onScrub.bind(this);

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

  getDuration() {
    const {
      nowPlayingItem,
      mk: { instance },
    } = this.props;

    if (!nowPlayingItem) {
      return 0;
    }

    return instance.isAuthorized ? nowPlayingItem.playbackDuration / 1000 : 30;
  }

  renderProgress() {
    const { mk } = this.props;
    const { playbackTime } = mk;

    const duration = this.getDuration();
    const percent = playbackTime
      ? PlayerTime.timeToPercent(playbackTime.currentPlaybackTime, duration)
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
        onTouchStart={this.onStartScrubbing}
        onMouseUp={this.onEndScrubbing}
        onTouchEnd={this.onEndScrubbing}
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
    const { isScrubbing, scrubbingPosition } = this.state;

    if (isScrubbing) {
      return scrubbingPosition;
    }

    const {
      mk: { playbackTime },
    } = this.props;

    if (playbackTime) {
      return playbackTime.currentPlaybackTime;
    }

    return 0;
  }

  render() {
    return (
      <div className={styles.progressBarWrapper}>
        <span className={styles.playbackTime}>{this.getCurrentPlaybackTime()}</span>
        {this.renderProgress()}
        <span className={styles.playbackDuration}>{this.getCurrentPlaybackDuration()}</span>
      </div>
    );
  }
}

const bindings = {
  [MusicKit.Events.playbackTimeDidChange]: 'playbackTime',
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
};

PlayerTime.propTypes = {
  mk: PropTypes.any.isRequired,
  nowPlayingItem: PropTypes.any.isRequired,
};

export default withMK(PlayerTime, bindings);
