import * as cx from 'classnames';
import * as React from 'react';
import useMK from '../../../../hooks/useMK';
import { isCurrentTrack, isTrackPlaying } from '../../../../services/MusicPlayerApi';
import { artworkForMediaItem } from '../../../../utils/Utils';
import * as classes from './TrackDecoration.scss';

export default function TrackDecoration({
  track,
  showAlbum,
  size = 40,
}: {
  track: any;
  showAlbum: boolean;
  size?: number;
}) {
  const isCurrent = isCurrentTrack(track);
  useMK({
    [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
    [MusicKit.Events.playbackStateDidChange]: 'playbackState',
  });

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
