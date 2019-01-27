import React from 'react';
import { MenuItem } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import classes from './TrackContextMenu.scss';
import { playLater, playNext, playTrack } from '../../../../../services/MusicPlayerApi';
import { addToLibrary, addSongsToPlaylist } from '../../../../../services/MusicApi';
import PlaylistSelector from '../../../PlaylistSelector/PlaylistSelector';
import ModalContext from '../../../Modal/ModalContext';
import translate from '../../../../../utils/translations/Translations';

function TrackContextMenu({ track, tracks, index }) {
  const { attributes } = track;
  const artworkURL = artworkForMediaItem(track, 60);
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

      <ModalContext.Consumer>
        {({ push, pop }) => (
          <MenuItem
            onClick={() =>
              push(
                <PlaylistSelector
                  onClick={async playlist => {
                    await addSongsToPlaylist(playlist.id, [track]);
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

TrackContextMenu.propTypes = {
  index: PropTypes.number.isRequired,
  track: PropTypes.any.isRequired,
  tracks: PropTypes.array.isRequired,
};

export default withRouter(TrackContextMenu);
