import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import classes from '../BrowsePage.scss';
import PlaylistItem from '../../../../../Common/PlaylistItem/PlaylistItem';
import AlbumItem from '../../../../../Common/AlbumItem/AlbumItem';
import FeaturedAlbum from './FeaturedAlbum/FeaturedAlbum';
import FeaturedPlaylist from './FeaturedPlaylist/FeaturedPlaylist';

function FeaturePanel(props) {
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
          const data = {
            ...item.item,
            tag: item.tag,
          };
          switch (data.type) {
            case 'playlists':
              return <FeaturedPlaylist key={data.id} playlist={data} />;
            case 'albums':
              return <FeaturedAlbum key={data.id} album={data} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

FeaturePanel.propTypes = {
  items: PropTypes.any.isRequired,
  rows: PropTypes.number,
  size: PropTypes.number,
};

FeaturePanel.defaultProps = {
  rows: 1,
  size: 170,
};

export default withRouter(FeaturePanel);
