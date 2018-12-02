import React from 'react';
import styles from './Player.scss'

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nowPlayingItem: null,
      queuePosition: null,
      queue: null,
      playbackTime: null,
    };

    this.mediaItemDidChange = this.mediaItemDidChange.bind(this);
    this.queueItemsDidChange = this.queueItemsDidChange.bind(this);
    this.queuePositionDidChange = this.queuePositionDidChange.bind(this);
    this.playbackTimeDidChange = this.playbackTimeDidChange.bind(this);

    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  mediaItemDidChange(event) {
    console.log('nowPlayingItem', event);
    this.setState({
      nowPlayingItem: event.item,
    });
  };

  queueItemsDidChange(event) {
    console.log('queue', event);
    this.setState({
      queue: event.items,
    });
  };

  queuePositionDidChange(event) {
    console.log('queuePosition', event);
    this.setState({
      queuePosition: event,
    });
  };

  playbackTimeDidChange(event) {
    this.setState({
      playbackTime: event,
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

    var url = 'https://itunes.apple.com/us/album/hamilton-original-broadway-cast-recording/1025210938';
    await music.setQueue({url: url});
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
  }

  handlePlay() {
    const music = MusicKit.getInstance();

    music.player.play();
  }

  handlePause() {
    const music = MusicKit.getInstance();

    music.player.pause();
  }

  handleStop() {
    const music = MusicKit.getInstance();

    music.player.stop();
  }

  handlePrevious() {
    const music = MusicKit.getInstance();

    if(this.state.playbackTime.currentPlaybackTime < 2) {
      music.player.skipToPreviousItem();
    } else {
      music.player.seekToTime(0)
    }
  }

  handleNext() {
    const music = MusicKit.getInstance();

    music.player.skipToNextItem();
  }

  renderProgress() {
    const t = this.state.playbackTime;

    if (!t || t.currentPlaybackDuration === 0) {
      return null;
    }

    const percent = (t.currentPlaybackTime * 100) / t.currentPlaybackDuration;

    return (
        <div style={{width: '100%', height: 3}}>
          <div style={{
            background: 'red',
            width: `${percent}%`,
            height: '100%',
          }}/>
        </div>
    );
  }

  render() {

    if (!this.state.nowPlayingItem) {
      return "";
    }

    console.log(this.state.nowPlayingItem);

    return (
      <div className={styles.player}>
        <div className={styles["main-info"]}>
          <div className={styles.picture}>
            <img src={this.state.nowPlayingItem.attributes.artwork.url} className={styles.image} alt={'album artwork'} />
          </div>
          <div className={styles.track}>
            <h1>{this.state.nowPlayingItem.title}</h1>
            <h2>{this.state.nowPlayingItem.attributes.artistName}</h2>
            <h3>{this.state.nowPlayingItem.attributes.albumName}</h3>
          </div>
        </div>
      </div>
    );
  }

      /*
    return (
        <div>
          {this.state.nowPlayingItem && (
              <div>
                {this.state.nowPlayingItem.title}
              </div>
          )}

          {this.renderProgress()}

          <div onClick={this.handlePlay}>
            Play
          </div>

          <div onClick={this.handlePause}>
            Pause
          </div>

          <div onClick={this.handleStop}>
            Stop
          </div>

          <div onClick={this.handlePrevious}>
            Previous
          </div>

          <div onClick={this.handleNext}>
            Next
          </div>
        </div>
    );
    */
}
