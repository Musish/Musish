import React from 'react';

import PropTypes from 'prop-types';
import classes from './TracksGrid.scss';
import TrackListItem from '../TracksList/TracksListItem';
import * as MusicPlayerApi from '../../../../services/MusicPlayerApi';

function TracksGrid({ tracks, showArtist, showAlbum, playTrack }) {
  function play({ track, index }) {
    if (playTrack) {
      playTrack({ tracks, track, index });
      return;
    }
    MusicPlayerApi.playTrack(tracks, index);
  }

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
            playTrack={play}
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
  playTrack: PropTypes.func,
};

TracksGrid.defaultProps = {
  showArtist: false,
  showAlbum: false,
  tracks: null,
  playTrack: null,
};

export default TracksGrid;
