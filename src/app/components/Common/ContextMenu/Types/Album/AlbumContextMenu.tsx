import React from 'react';
import { MenuItem } from 'react-contextmenu';
import { addAlbumToPlaylist, addToLibrary } from '../../../../../services/MusicApi';
import { playAlbum, playLater, playNext } from '../../../../../services/MusicPlayerApi';
import translate from '../../../../../utils/translations/Translations';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import { useModal } from '../../../../Providers/ModalProvider';
import AlbumPanel from '../../../AlbumPanel/AlbumPanel';
import PlaylistSelector from '../../../PlaylistSelector/PlaylistSelector';
import classes from './AlbumContextMenu.scss';

interface AlbumContextMenuProps {
  album: MusicKit.MediaItem;
}

const AlbumContextMenu: React.FC<AlbumContextMenuProps> = ({ album }) => {
  const { push: pushModal, pop: popModal } = useModal();

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

      <MenuItem onClick={() => pushModal(<AlbumPanel key={album.id} album={album} pseudoRoute />)}>
        {translate.openAlbum}
      </MenuItem>

      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={() => addToLibrary('albums', [album.id])}>
            {translate.addToLibrary}
          </MenuItem>
        </>
      )}

      <MenuItem
        onClick={() =>
          pushModal(
            <PlaylistSelector
              onClick={async playlist => {
                await addAlbumToPlaylist(playlist.id, album.id);
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

export default AlbumContextMenu;
