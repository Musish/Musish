import React from 'react';
import { MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import classes from './AlbumContextMenu.scss';
import { playAlbum, playNext, playLater } from '../../../../../services/MusicPlayerApi';
import ModalContext from '../../../Modal/ModalContext';
import AlbumPanel from '../../../AlbumPanel/AlbumPanel';
import { addAlbumToPlaylist, addToLibrary } from '../../../../../services/MusicApi';
import PlaylistSelector from '../../../PlaylistSelector/PlaylistSelector';
import translate from '../../../../../utils/translations/Translations';

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

      <MenuItem onClick={() => playAlbum(album, 0)}>{translate.play}</MenuItem>
      <MenuItem onClick={() => playNext(album)}>{translate.playNext}</MenuItem>
      <MenuItem onClick={() => playLater(album)}>{translate.playLater}</MenuItem>

      <MenuItem divider />

      <ModalContext.Consumer>
        {({ push }) => (
          <MenuItem onClick={() => push(<AlbumPanel key={album.id} album={album} />)}>
            {translate.openAlbum}
          </MenuItem>
        )}
      </ModalContext.Consumer>

      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={() => addToLibrary('albums', [album.id])}>
            {translate.addToLibrary}
          </MenuItem>
        </>
      )}

      <ModalContext.Consumer>
        {({ push, pop }) => (
          <MenuItem
            onClick={() =>
              push(
                <PlaylistSelector
                  onClick={async playlist => {
                    await addAlbumToPlaylist(playlist.id, album.id);
                    pop();
                  }}
                />,
                {
                  width: 'auto',
                }
              )
            }
          >
            {translate.addToPlaylist}
          </MenuItem>
        )}
      </ModalContext.Consumer>
    </>
  );
}

AlbumContextMenu.propTypes = {
  album: PropTypes.object.isRequired,
};

export default withRouter(AlbumContextMenu);
