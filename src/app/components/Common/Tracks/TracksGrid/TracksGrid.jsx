import React from 'react';

import PropTypes from 'prop-types';
import classes from './TracksGrid.scss';
import TrackListItem from '../TracksList/TracksListItem';

function TracksGrid({ tracks, showArtist, showAlbum, playTrack }) {
  return (
    <div className={classes.scrollWrapper}>
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
}

TracksGrid.propTypes = {
  showArtist: PropTypes.bool,
  showAlbum: PropTypes.bool,
  tracks: PropTypes.array,
  playTrack: PropTypes.func.isRequired,
};

TracksGrid.defaultProps = {
  showArtist: false,
  showAlbum: false,
  tracks: null,
};

export default TracksGrid;
