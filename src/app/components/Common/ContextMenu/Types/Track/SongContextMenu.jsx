import React from 'react';
import { MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import classes from './SongContextMenu.scss';
import { playLater, playNext, playSong } from '../../../../../services/MusicPlayerApi';

function SongContextMenu({ song, songs, index }) {
  const { attributes } = song;
  const artworkURL = artworkForMediaItem(song, 60);
  const inLibrary = attributes.playParams.isLibrary;

  return (
    <>
      <div className={classes.itemInfo}>
        <div className={classes.artwork}>
          <div className={classes.artworkWrapper}>
            <img src={artworkURL} alt={attributes.name} />
          </div>
        </div>
        <div className={classes.description}>
          <h1>{attributes.name}</h1>
          <h2>{attributes.artistName}</h2>
          <h3>{attributes.albumName}</h3>
        </div>
      </div>

      <MenuItem divider />

      <MenuItem onClick={() => playSong(songs, index)}>Play</MenuItem>
      <MenuItem onClick={() => playNext(song)}>Play next</MenuItem>
      <MenuItem onClick={() => playLater(song)}>Play later</MenuItem>

      <MenuItem divider />

      <MenuItem onClick={() => null}>Show Artist</MenuItem>
      <MenuItem onClick={() => null}>Show Album</MenuItem>
      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={() => null}>Add to library</MenuItem>
        </>
      )}
    </>
  );
}

SongContextMenu.propTypes = {
  index: PropTypes.number.isRequired,
  song: PropTypes.any.isRequired,
  songs: PropTypes.array.isRequired,
};

export default withRouter(SongContextMenu);
