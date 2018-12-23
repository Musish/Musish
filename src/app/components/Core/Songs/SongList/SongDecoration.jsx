import React from 'react';
import cx from 'classnames';
import withMK from '../../../../hoc/withMK';
import classes from './SongDecoration.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import { isCurrentSong, isSongPlaying } from '../../../../services/MusicPlayerApi';

function SongDecoration({ song, showAlbum, size = 40 }) {
  const currentItem = isCurrentSong(song);

  const playingAnimation = (
    <div className={cx(classes.playingAnimation, { [classes.animated]: isSongPlaying(song) })}>
      <div>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );

  return (
    <>
      {showAlbum ? (
        <span className={classes.albumArtwork}>
          {currentItem && playingAnimation}
          <span className={classes.artworkWrapper} style={{ width: size, height: size }}>
            <img src={artworkForMediaItem(song, size)} alt="" />
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
