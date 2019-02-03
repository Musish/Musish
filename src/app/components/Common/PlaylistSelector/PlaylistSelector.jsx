import React from 'react';
import PropTypes from 'prop-types';
import withContext from '../../../hoc/withContext';
import PlaylistsContext from '../../Inside/Sidebar/PlaylistsContext';
import classes from './PlaylistSelector.scss';

function PlaylistSelector(props) {
  const { playlists, onClick } = props;

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
  playlists: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

PlaylistSelector.defaultProps = {
  onClick: () => null,
};

export default withContext(PlaylistSelector, PlaylistsContext);
