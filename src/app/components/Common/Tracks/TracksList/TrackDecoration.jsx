import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withMK from '../../../../hoc/withMK';
import classes from './TrackDecoration.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import { isCurrentTrack, isTrackPlaying } from '../../../../services/MusicPlayerApi';

function TrackDecoration({ track, showAlbum, size = 40 }) {
  const currentItem = isCurrentTrack(track);

  const playingAnimation = (
    <div className={cx(classes.playingAnimation, { [classes.animated]: isTrackPlaying(track) })}>
      <div>
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
            <img src={artworkForMediaItem(track, size)} alt="" />
          </span>
        </span>
      ) : (
        <span className={classes.trackIndex}>
          {currentItem ? playingAnimation : track.attributes.trackNumber}
        </span>
      )}
    </>
  );
}

TrackDecoration.propTypes = {
  track: PropTypes.any.isRequired,
  showAlbum: PropTypes.bool.isRequired,
  size: PropTypes.number,
};

TrackDecoration.defaultProps = {
  size: 40,
};

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
  [MusicKit.Events.playbackStateDidChange]: 'playbackState',
};

export default withMK(TrackDecoration, bindings);
