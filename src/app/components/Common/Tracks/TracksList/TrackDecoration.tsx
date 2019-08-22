import * as cx from 'classnames';
import * as React from 'react';
import useMK from '../../../../hooks/useMK';
import { isCurrentTrack, isTrackPlaying } from '../../../../services/MusicPlayerApi';
import { artworkForMediaItem } from '../../../../utils/Utils';
import * as classes from './TrackDecoration.scss';

export default function TrackDecoration({
  track,
  showAlbum = false,
  size = 40,
}: {
  track: MusicKit.MediaItem;
  showAlbum?: boolean;
  size?: number;
}) {
  useMK({
    mediaItem: MusicKit.Events.mediaItemDidChange,
    playbackState: MusicKit.Events.playbackStateDidChange,
  });

  const isCurrent = isCurrentTrack(track);

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
          {isCurrent && playingAnimation}
          <span className={classes.artworkWrapper} style={{ width: size, height: size }}>
            <img src={artworkForMediaItem(track, size)} alt='' />
          </span>
        </span>
      ) : (
        <span className={classes.trackIndex}>
          {isCurrent ? playingAnimation : track.attributes.trackNumber}
        </span>
      )}
    </>
  );
}
