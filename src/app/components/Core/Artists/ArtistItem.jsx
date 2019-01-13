import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classes from './ArtistItem.scss';

function ArtistItem(props) {
  const { artist, size } = props;

  const link = isNaN(artist.id) ? `/me/artists/${artist.id}` : `/artist/${artist.id}`;
  const initials = artist.attributes.name
    .split(' ')
    .map(n => n.substring(0, 1))
    .filter(c => !/[^a-zA-Z0-9]/.test(c))
    .slice(0, 2);

  return (
    <Link to={link}>
      <div className={classes.container}>
        <div>
          <span className={classes.pictureWrapper} style={{ width: size, height: size }}>
            <span>{initials}</span>
          </span>
        </div>
        <div className={classes.descriptionContainer}>
          <span className={classes.artistName}>{artist.attributes.name}</span>
        </div>
      </div>
    </Link>
  );
}

ArtistItem.propTypes = {
  artist: PropTypes.any,
  size: PropTypes.number.isRequired,
};

ArtistItem.defaultProps = {
  artist: null,
};

export default ArtistItem;
