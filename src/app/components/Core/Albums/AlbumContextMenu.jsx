import React from 'react';
import { MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { artworkForMediaItem } from '../../../utils/Utils';
import classes from './AlbumContextMenu.scss';
import { playAlbum } from '../../../services/MusicPlayerApi';
import ModalContext from '../../common/Modal/ModalContext';
import AlbumPanel from './AlbumPanel';
import { addToLibrary } from '../../../services/MusicApi';

function AlbumContextMenu({ album }) {
  const { attributes } = album;
  const artworkURL = artworkForMediaItem(album, 60);
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
          <h2>{attributes.name}</h2>
          <h3>{attributes.artistName}</h3>
        </div>
      </div>

      <MenuItem divider />

      <MenuItem onClick={() => playAlbum(album, 0)}>Play</MenuItem>

      <MenuItem divider />

      <ModalContext.Consumer>
        {({ push }) => (
          <MenuItem onClick={() => push(<AlbumPanel album={album} />)}>Open Album</MenuItem>
        )}
      </ModalContext.Consumer>
      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={() => addToLibrary('albums', [album.id])}>Add to library</MenuItem>
        </>
      )}
    </>
  );
}

AlbumContextMenu.propTypes = {
  album: PropTypes.array.isRequired,
};

export default withRouter(AlbumContextMenu);
