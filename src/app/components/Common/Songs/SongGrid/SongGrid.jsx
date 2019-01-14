import React from 'react';

import PropTypes from 'prop-types';
import classes from './SongGrid.scss';
import SongListItem from '../SongList/SongListItem';

function SongGrid({ tracks, showArtist, showAlbum, playSong }) {
  return (
    <div className={classes.scrollWrapper}>
      <div className={classes.songGrid}>
        {tracks.map((track, index) => (
          <SongListItem
            key={track.id}
            song={track}
            index={index}
            songs={tracks}
            showArtist={showArtist}
            showAlbum={showAlbum}
            playSong={playSong}
            className={classes.song}
          />
        ))}
      </div>
    </div>
  );
}

SongGrid.propTypes = {
  showArtist: PropTypes.bool,
  showAlbum: PropTypes.bool,
  tracks: PropTypes.array,
  playSong: PropTypes.func.isRequired,
};

SongGrid.defaultProps = {
  showArtist: false,
  showAlbum: false,
  tracks: null,
};

export default SongGrid;
