import cx from 'classnames';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { artworkForMediaItem } from '../../../utils/Utils';
import classes from './CuratorItem.scss';

interface ICuratorItemProps extends RouteComponentProps {
  curator?: any;
  id?: string;
  size: number;
}

const CuratorItem: React.FC<ICuratorItemProps> = ({
  size,
  history,
  curator,
  id,
}: ICuratorItemProps) => {
  const artwork = artworkForMediaItem(curator, size);

  function handleOpen() {
    const curatorId = id || curator.id;

    history.push(`/curator/${curatorId}`);
  }

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
};

export default withRouter(CuratorItem);
