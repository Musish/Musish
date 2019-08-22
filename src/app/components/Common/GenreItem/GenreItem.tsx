import cx from 'classnames';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { artworkForMediaItem } from '../../../utils/Utils';
import classes from './GenreItem.scss';

interface GenreItemProps extends RouteComponentProps {
  curator?: any;
  id?: string;
  size: number;
}

const GenreItem: React.FC<GenreItemProps> = ({ curator, history, id, size }) => {
  function handleOpen() {
    const curatorId = id || curator.id;

    history.push(`/browse/genre/${curatorId}`);
  }

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
          <span style={{ width: size }}>{curator.attributes.name}</span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(GenreItem);
