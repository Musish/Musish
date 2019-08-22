import React from 'react';
import { MenuItem } from 'react-contextmenu';
import { addPlaylistToPlaylist, addToLibrary } from '../../../../../services/MusicApi';
import { playLater, playNext, playPlaylist } from '../../../../../services/MusicPlayerApi';
import translate from '../../../../../utils/translations/Translations';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import { useModal } from '../../../../Providers/ModalProvider';
import PlaylistPanel from '../../../PlaylistPanel/PlaylistPanel';
import PlaylistSelector from '../../../PlaylistSelector/PlaylistSelector';
import classes from './PlaylistContextMenu.scss';

interface PlaylistContextMenuProps {
  playlist: any;
}

const PlaylistContextMenu: React.FC<PlaylistContextMenuProps> = ({ playlist }) => {
  const { push: pushModal, pop: popModal } = useModal();

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

      <MenuItem onClick={() => playPlaylist(playlist, 0)}>{translate.play}</MenuItem>
      <MenuItem onClick={() => playNext(playlist)}>{translate.playNext}</MenuItem>
      <MenuItem onClick={() => playLater(playlist)}>{translate.playLater}</MenuItem>

      <MenuItem divider />

      <MenuItem onClick={() => pushModal(<PlaylistPanel playlist={playlist} pseudoRoute />)}>
        {translate.openPlaylist}
      </MenuItem>

      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={() => addToLibrary('playlists', [playlist.id])}>
            {translate.addToLibrary}
          </MenuItem>
        </>
      )}

      <MenuItem
        onClick={() =>
          pushModal(
            <PlaylistSelector
              onClick={async targetPlaylist => {
                await addPlaylistToPlaylist(targetPlaylist.id, playlist.id);
                popModal();
              }}
            />,
            {
              width: 'auto',
            },
          )
        }
      >
        {translate.addToPlaylist}
      </MenuItem>
    </>
  );
};

export default PlaylistContextMenu;
