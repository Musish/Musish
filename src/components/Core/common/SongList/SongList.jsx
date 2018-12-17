import React from 'react';

import classes from './SongList.scss';
import InfiniteScroll from "../InfiniteScroll";
import {connectMenu, ContextMenu, MenuItem} from "react-contextmenu";
import SongListItem from "./SongListItem";

export const MENU_TYPE = 'DYNAMIC';

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
      songs: null,
    };

    this.onMediaItemDidChange = this.onMediaItemDidChange.bind(this);
    this.playbackStateDidChange = this.playbackStateDidChange.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onSetItems = this.onSetItems.bind(this);
  }

  onMediaItemDidChange(event) {
    this.setState({
      currentSong: event.item.id
    })
  }

  onSetItems({items: songs}) {
    this.setState({
      songs
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
    const {currentSong, isPlaying, songs} = this.state;
    const {album, showArtist, showAlbum} = this.props;

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
    const {showArtist, showAlbum, scrollElement, load} = this.props;

    return (
      <div className={classes.songList}>
        <InfiniteScroll onSetItems={this.onSetItems}
                        scrollElement={scrollElement}
                        load={load}
                        rowHeight={showAlbum || showArtist ? 50 : 37}
                        rowRenderer={this.rowRenderer}/>
        <ConnectedMenu/>
      </div>
    );
  }
}

SongList.defaultProps = {
  showArtist: false,
  showAlbum: false
};
