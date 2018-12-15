import React from 'react';

import classes from './SongList.scss';
import {artworkForMediaItem, createMediaItem} from "../Utils";
import InfiniteScroll from "../InfiniteScroll";
import {connectMenu, ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";

const MENU_TYPE = 'DYNAMIC';

function DynamicMenu({id, trigger}) {
  if (!trigger) {
    return null
  }

  const {song: {attributes}} = trigger.song;
  const inLibrary = attributes.playParams.isLibrary;

  return (
    <ContextMenu id={id}>
      <div className={"item-info"}>
        <div className={"artwork"}>
          <div className={"artwork-wrapper"}>
            <img src={trigger.artworkURL}/>
          </div>
        </div>
        <div className={"description"}>
          <h1>{attributes.name}</h1>
          <h2>{attributes.artistName}</h2>
          <h3>{attributes.albumName}</h3>
        </div>
      </div>

      <MenuItem divider/>

      <MenuItem onClick={trigger._playSong}>
        Play
      </MenuItem>
      <MenuItem onClick={trigger._queueNext}>
        Play next
      </MenuItem>
      <MenuItem onClick={trigger._queueLater}>
        Play later
      </MenuItem>

      <MenuItem divider/>

      <MenuItem onClick={trigger._queueLater}>
        Show Artist
      </MenuItem>
      <MenuItem onClick={trigger._queueLater}>
        Show Album
      </MenuItem>
      {!inLibrary && (
        <>

          <MenuItem divider/>

          <MenuItem onClick={trigger._queueLater}>
            Add to library
          </MenuItem>
        </>
      )}
    </ContextMenu>
  )
}

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

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
    this.rowRenderer = this.rowRenderer.bind(this);
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

  rowRenderer({item: song, index, isScrolling, isVisible, key, style}) {
    const {currentSong, isPlaying} = this.state;
    const {songs, album, showArtist, showAlbum} = this.props;

    return (
      <SongListItem
        key={key}
        song={song}
        index={index}
        songs={songs}
        albumArt={!album}
        isPlaying={song.attributes.playParams && song.attributes.playParams.catalogId === currentSong && isPlaying}
        showArtist={showArtist}
        showAlbum={showAlbum}
        style={style}
      />
    )
  }

  render() {
    return (
      <div className={classes.songList}>
        <InfiniteScroll scrollElement={this.props.scrollElement} load={this.props.load} rowHeight={50} rowRenderer={this.rowRenderer}/>
        <ConnectedMenu/>
      </div>
    );
  }
}

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

class SongListItem extends React.Component {
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
      <>
        {albumArt ? (
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
      <div className={`${classes.song} ${isPlaying ? 'playing' : ''}`} onClick={this._handleClick} style={this.props.style}>
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

SongList.defaultProps = {
  showArtist: false,
  showAlbum: false
};
