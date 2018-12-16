import React from 'react';
import styles from './Player.scss'
import {artworkForMediaItem} from "../common/Utils";
import debounce from 'lodash/debounce';

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    const music = MusicKit.getInstance();

    this.state = {
      nowPlayingItem: null,
      queuePosition: null,
      queue: null,
      playbackTime: 0,
      isPlaying: music.player.isPlaying,
    };

    this.mediaItemDidChange = this.mediaItemDidChange.bind(this);
    this.queueItemsDidChange = this.queueItemsDidChange.bind(this);
    this.queuePositionDidChange = this.queuePositionDidChange.bind(this);
    this.playbackTimeDidChange = this.playbackTimeDidChange.bind(this);
    this.playbackStateDidChange = this.playbackStateDidChange.bind(this);

    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleSeek = this.handleSeek.bind(this);

    this.scrubToTime = debounce(Player.scrubToTime, 100).bind(this);
  }

  static scrubToTime(time) {
    const music = MusicKit.getInstance();
    music.player.seekToTime(time);
  }

  static timeToPercent(time, duration) {
    if (duration === 0) {
      return 0; // For some reason would call this
    }
    return Math.floor((time * 100) / duration);
  }

  static percentToTime(percent, duration) {
    return Math.floor((percent * duration) / 100);
  }

  mediaItemDidChange(event) {
    this.setState({
      nowPlayingItem: event.item,
    });
  };

  queueItemsDidChange(event) {
    this.setState({
      queue: event.items,
    });
  };

  queuePositionDidChange(event) {
    this.setState({
      queuePosition: event,
    });
  };

  playbackTimeDidChange(event) {
    this.changePlaybackTime(event.currentPlaybackTime);
  };

  changePlaybackTime(time) {
    this.setState({
      playbackTime: time,
    });
  };

  playbackStateDidChange(event) {
    const music = MusicKit.getInstance();
    this.setState({
      isPlaying: music.player.isPlaying,
    });
  };

  async componentDidMount() {
    const music = MusicKit.getInstance();

    music.addEventListener(
      MusicKit.Events.mediaItemDidChange,
      this.mediaItemDidChange,
    );
    music.addEventListener(
      MusicKit.Events.queueItemsDidChange,
      this.queueItemsDidChange,
    );
    music.addEventListener(
      MusicKit.Events.queuePositionDidChange,
      this.queuePositionDidChange,
    );
    music.addEventListener(
      MusicKit.Events.playbackTimeDidChange,
      this.playbackTimeDidChange,
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
      this.mediaItemDidChange,
    );
    music.removeEventListener(
      MusicKit.Events.queueItemsDidChange,
      this.queueItemsDidChange,
    );
    music.removeEventListener(
      MusicKit.Events.queuePositionDidChange,
      this.queuePositionDidChange,
    );
    music.removeEventListener(
      MusicKit.Events.playbackTimeDidChange,
      this.playbackTimeDidChange,
    );
    music.removeEventListener(
      MusicKit.Events.playbackStateDidChange,
      this.playbackStateDidChange,
    );
  }

  handlePlay() {
    const music = MusicKit.getInstance();
    music.player.play();
  }

  handlePause() {
    const music = MusicKit.getInstance();
    music.player.pause();
  }

  handlePrevious() {
    const music = MusicKit.getInstance();

    if (this.state.playbackTime < 2) {
      music.player.skipToPreviousItem();
    } else {
      music.player.seekToTime(0)
    }
  }

  handleNext() {
    const music = MusicKit.getInstance();
    music.player.skipToNextItem();
  }

  handleSeek(percent, duration) {
    const time = Player.percentToTime(percent, duration);
    this.changePlaybackTime(time);
    this.scrubToTime(time);
  }

  renderProgress() {
    const {nowPlayingItem, playbackTime} = this.state;
    const duration = Math.round(nowPlayingItem.playbackDuration / 1000);
    const percent = Player.timeToPercent(playbackTime, duration);
    return (
      <input
        className={styles["progress-bar"]}
        style={{"backgroundSize": `${percent}% 100%`}}
        type="range"
        value={percent}
        onChange={(event) => {
          this.handleSeek(event.target.value, duration)
        }}
        min="0"
      />
    );
  }

  renderVolume() {
    const percent = 50;
    return (
      <div className={styles["progress-bar"]}>
        <div style={{
          width: `${percent}%`
        }}/>
      </div>
    );
  }

  render() {
    if (!this.state.nowPlayingItem) {
      return "";
    }
    const nowPlayingItem = this.state.nowPlayingItem;
    const artworkURL = artworkForMediaItem(nowPlayingItem, 40);
    return (
      <div className={styles.player}>
        <div className={styles["main-info"]}>
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
            <i className={"fas fa-backward"}/>
          </span>
          {this.state.isPlaying ? (
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

          <span className={styles.controls}>
            <i className={"fas fa-redo-alt"}/>
          </span>

          <span className={styles.controls}>
              <i className={"fas fa-plus"}/>
          </span>

          <span className={styles.controls}>
              <i className={"fas fa-random"}/>
          </span>

          <span className={styles.controls}>
              <i className={"fas fa-volume-up"}/>
          </span>

        </div>

      </div>
    );
  }
}
