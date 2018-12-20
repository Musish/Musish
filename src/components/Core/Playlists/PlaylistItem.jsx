import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classes from './PlaylistItem.scss';

export default function PlaylistItem(props) {
  const { playlist, size } = props;
  const artwork = MusicKit.formatArtworkURL(playlist.attributes.artwork, size, size);

  return (
    <Link to={`/playlists/${playlist.id}`} className={classes.container} style={{ width: size }}>
      <div className={classes.imageContainer} style={{ width: size, height: size }}>
        <img
          src={artwork}
          className={classes.image}
          style={{ width: size, height: size }}
          alt={playlist.attributes.name}
        />
      </div>

      <div className={classes.descriptionContainer}>
        <span className={classes.playlistName} style={{ width: size }}>
          {playlist.attributes.name}
        </span>
      </div>
    </Link>
  );
}

PlaylistItem.propTypes = {
  playlist: PropTypes.any.isRequired,
  size: PropTypes.number.isRequired,
};
