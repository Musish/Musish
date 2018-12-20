import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classes from './SearchBar.scss';
import { artworkForMediaItem } from '../../../common/Utils';

function AlbumResultItem(props) {
  const { album, size } = props;
  return (
    <Link to={`/albums/${album.id}`}>
      <div className={cx(classes.result, classes.album)}>
        <span className={classes.artwork}>
          <img
            src={artworkForMediaItem(album, size)}
            alt=""
            style={{ width: size, height: size }}
          />
        </span>

        <span className={classes.name}>{album.attributes.name}</span>
      </div>
    </Link>
  );
}

AlbumResultItem.propTypes = {
  album: PropTypes.any.isRequired,
  size: PropTypes.any.isRequired,
};

export default AlbumResultItem;
