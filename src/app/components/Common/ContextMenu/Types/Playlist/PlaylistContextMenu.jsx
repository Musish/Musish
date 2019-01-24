import React from 'react';
import { MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import classes from './PlaylistContextMenu.scss';
import { playPlaylist } from '../../../../../services/MusicPlayerApi';
import ModalContext from '../../../Modal/ModalContext';
import PlaylistPanel from '../../../PlaylistPanel/PlaylistPanel';
import { addPlaylistToPlaylist, addToLibrary } from '../../../../../services/MusicApi';
import PlaylistSelector from '../../../PlaylistSelector/PlaylistSelector';

function PlaylistContextMenu({ playlist }) {
  const { attributes } = playlist;
  const artworkURL = artworkForMediaItem(playlist, 60);
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

      <MenuItem onClick={() => playPlaylist(playlist, 0)}>Play</MenuItem>

      <MenuItem divider />

      <ModalContext.Consumer>
        {({ push }) => (
          <MenuItem onClick={() => push(<PlaylistPanel playlist={playlist} />)}>
            Open Playlist
          </MenuItem>
        )}
      </ModalContext.Consumer>

      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={() => addToLibrary('playlists', [playlist.id])}>
            Add to library
          </MenuItem>
        </>
      )}

      <ModalContext.Consumer>
        {({ push, pop }) => (
          <MenuItem
            onClick={() =>
              push(
                <PlaylistSelector
                  onClick={async targetPlaylist => {
                    await addPlaylistToPlaylist(targetPlaylist.id, playlist.id);
                    pop();
                  }}
                />,
                {
                  width: 'auto',
                }
              )
            }
          >
            Add to playlist
          </MenuItem>
        )}
      </ModalContext.Consumer>
    </>
  );
}

PlaylistContextMenu.propTypes = {
  playlist: PropTypes.object.isRequired,
};

export default withRouter(PlaylistContextMenu);
