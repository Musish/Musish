import React from 'react';
import styles from './Player.scss'

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    const music = MusicKit.getInstance();

    this.state = {
      nowPlayingItem: null,
      queuePosition: null,
      queue: null,
      playbackTime: null,
      isPlaying: music.player.isPlaying,
    };

    this.mediaItemDidChange = this.mediaItemDidChange.bind(this);
    this.queueItemsDidChange = this.queueItemsDidChange.bind(this);
    this.queuePositionDidChange = this.queuePositionDidChange.bind(this);
    this.playbackTimeDidChange = this.playbackTimeDidChange.bind(this);
    this.playbackStateDidChange = this.playbackStateDidChange.bind(this);

    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
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
    this.setState({
      playbackTime: event,
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
      return (<div className={styles["progress-bar"]}><div></div></div>);
    }

    const percent = (t.currentPlaybackTime * 100) / t.currentPlaybackDuration;

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

    return (
      <div className={styles.player}>
        <div className={styles["main-info"]}>
          <div className={styles.picture}>
            <img src={nowPlayingItem.attributes.artwork.url} className={styles.image} alt={'album artwork'} />
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
            <i className="fas fa-backward"></i>
          </span>
          {this.state.isPlaying ? (
            <span onClick={this.handlePause}>
            <i className="fas fa-pause"></i>
          </span>
          ) : (
            <span onClick={this.handlePlay}>
            <i className="fas fa-play"></i>
          </span>
          )}
          <span onClick={this.handleNext}>
            <i className="fas fa-forward"></i>
          </span>
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
