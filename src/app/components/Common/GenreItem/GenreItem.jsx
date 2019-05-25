import React from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import classes from './GenreItem.scss';
import { artworkForMediaItem } from '../../../utils/Utils';

function GenreItem(props) {
  function handleOpen() {
    const id = props.id || props.curator.id;

    props.history.push(`/browse/genre/${id}`);
  }

  const { curator, size } = props;
  const artwork = artworkForMediaItem(curator, size);

  return (
    <div className={cx(classes.container)} style={{ width: size }}>
      <div onClick={handleOpen}>
        <div className={classes.imageContainer} style={{ width: size, height: size }}>
          <img
            src={artwork}
            className={classes.image}
            style={{ width: size, height: size }}
            alt={curator.attributes.name}
            title={curator.attributes.name}
          />
        </div>

        <div className={classes.descriptionContainer}>
          <span className={classes.curatorName} style={{ width: size }}>
            {curator.attributes.name}
          </span>
        </div>
      </div>
    </div>
  );
}

GenreItem.propTypes = {
  history: PropTypes.any.isRequired,
  curator: PropTypes.any,
  id: PropTypes.any,
  size: PropTypes.number.isRequired,
};

GenreItem.defaultProps = {
  curator: null,
  id: null,
};

export default withRouter(GenreItem);
