import React from 'react';
import { MenuItem } from 'react-contextmenu';
import { addSongsToPlaylist, addToLibrary } from '../../../../../services/MusicApi';
import { playLater, playNext, playTrack } from '../../../../../services/MusicPlayerApi';
import translate from '../../../../../utils/translations/Translations';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import { useModal } from '../../../../Providers/ModalProvider';
import PlaylistSelector from '../../../PlaylistSelector/PlaylistSelector';
import classes from './TrackContextMenu.scss';

interface TrackContextMenuProps {
  track: MusicKit.MediaItem;
  tracks: MusicKit.MediaItem[];
  index: number;
}

const TrackContextMenu: React.FC<TrackContextMenuProps> = ({ track, tracks, index }) => {
  const { push: pushModal, pop: popModal } = useModal();

  const { attributes } = track;
  const artworkURL = artworkForMediaItem(track, 60);
  const inLibrary = attributes.playParams && attributes.playParams.isLibrary;

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

      <MenuItem onClick={() => playTrack(tracks, index)}>{translate.play}</MenuItem>
      <MenuItem onClick={() => playNext(track)}>{translate.playNext}</MenuItem>
      <MenuItem onClick={() => playLater(track)}>{translate.playLater}</MenuItem>

      {!inLibrary && (
        <>
          <MenuItem divider />

          <MenuItem onClick={() => addToLibrary('songs', [track.id])}>
            {translate.addToLibrary}
          </MenuItem>
        </>
      )}

      <MenuItem
        onClick={() =>
          pushModal(
            <PlaylistSelector
              onClick={async playlist => {
                await addSongsToPlaylist(playlist.id, [track]);
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

export default TrackContextMenu;
