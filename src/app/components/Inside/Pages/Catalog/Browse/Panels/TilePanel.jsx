import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import classes from './BrowsePage.scss';
import PlaylistItem from '../../../../Common/PlaylistItem/PlaylistItem';
import AlbumItem from '../../../../Common/AlbumItem/AlbumItem';

function TilePanel(props) {
  const { items, rows, size } = props;

  if (!items) {
    return null;
  }

  const styles = {
    gridTemplateRows: 'auto '.repeat(rows),
  };

  return (
    <div className={classes.scrollWrapper}>
      <div className={cx(classes.scrollGrid)} style={styles}>
        {items.map(item => {
          if (!item) {
            return null;
          }
          switch (item.type) {
            case 'playlists':
              return <PlaylistItem key={item.id} playlist={item} size={size} />;
            case 'albums':
              return <AlbumItem key={item.id} album={item} size={size} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

TilePanel.propTypes = {
  items: PropTypes.any.isRequired,
  rows: PropTypes.number,
  size: PropTypes.number,
};

TilePanel.defaultProps = {
  rows: 1,
  size: 170,
};

export default withRouter(TilePanel);
