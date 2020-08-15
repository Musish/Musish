import * as React from 'react';

import commonClasses from '../../../../assets/styles/common.scss';
import TrackListItem from '../TracksList/TracksListItem';
import classes from './TracksGrid.scss';

interface TracksGridProps {
  showArtist?: boolean;
  showAlbum?: boolean;
  tracks: any[];
  playTrack: ({
    track,
    tracks,
    index,
  }: {
    track: MusicKit.MediaItem;
    tracks: MusicKit.MediaItem[];
    index: number;
  }) => void;
}

const TracksGrid: React.FC<TracksGridProps> = ({
  tracks,
  showArtist = false,
  showAlbum = false,
  playTrack,
}) => {
  return (
    <div className={commonClasses.scrollWrapperThin}>
      <div className={classes.trackGrid}>
        {tracks.map((track, index) => (
          <TrackListItem
            key={track.id}
            track={track}
            index={index}
            tracks={tracks}
            showArtist={showArtist}
            showAlbum={showAlbum}
            playTrack={playTrack}
            className={classes.track}
          />
        ))}
      </div>
    </div>
  );
};

export default TracksGrid;
