import React from 'react';
import PropTypes from 'prop-types';
import classes from './PlaylistSelector.scss';
import { usePlaylists } from '../../Providers/PlaylistsProvider';

function PlaylistSelector({ onClick }) {
  const { playlists } = usePlaylists();

  return (
    <div>
      {playlists.map(playlist => (
        <div key={playlist.id} className={classes.playlist} onClick={() => onClick(playlist)}>
          {playlist.attributes.name}
        </div>
      ))}
    </div>
  );
}

PlaylistSelector.propTypes = {
  onClick: PropTypes.func,
};

PlaylistSelector.defaultProps = {
  onClick: () => null,
};

export default PlaylistSelector;
