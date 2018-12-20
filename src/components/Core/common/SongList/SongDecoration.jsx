import React from 'react';
import withMK from "../../../../hoc/withMK";
import cx from "classnames";
import classes from "./SongDecoration.scss";
import {artworkForMediaItem, isPlaying, isCurrentItem} from "../Utils";

function SongDecoration({song, showAlbum, size = 40}) {
  const currentItem = isCurrentItem(song);

  const playingAnimation = (
    <div className={cx(classes.playingAnimation, {[classes.animated]: isPlaying(song)})}>
      <div><span/><span/><span/><span/><span/></div>
    </div>
  );

  return (
    <>
      {showAlbum ? (
        <span className={classes.albumArtwork}>
            {currentItem && playingAnimation}
          <span className={classes.artworkWrapper} style={{width: size, height: size}}>
              <img src={artworkForMediaItem(song, size)} alt=""/>
            </span>
          </span>
      ) : (
        <span className={classes.songIndex}>
            {currentItem ? playingAnimation : song.attributes.trackNumber}
          </span>
      )}
    </>
  );
}

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
  [MusicKit.Events.playbackStateDidChange]: 'playbackState',
};

export default withMK(SongDecoration, bindings);
