import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';
import DragDropType from '../../../../utils/Constants/DragDropType';
import classes from './Sidebar.scss';
import * as MusicApi from '../../../../services/MusicApi';

function PlaylistMenuItem(props) {
  const { playlist, connectDropTarget, isDndOver, activeDndItem } = props;
  const to = `/playlists/${playlist.id}`;

  return connectDropTarget(
    <li>
      <Route path={to} exact>
        {({ match }) => (
          <Link
            to={to}
            className={cx(
              { [classes.active]: !!match },
              { [classes.dndSeeking]: activeDndItem },
              { [classes.dndHovered]: isDndOver }
            )}
          >
            {playlist.attributes.name}
          </Link>
        )}
      </Route>
    </li>
  );
}

PlaylistMenuItem.propTypes = {
  playlist: PropTypes.object.isRequired,
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isDndOver: monitor.isOver(),
    activeDndItem: monitor.getItemType(),
  };
}

const dndSpec = {
  canDrop(props) {
    return true;
  },
  drop(props, monitor) {
    const { playlist } = props;
    const item = monitor.getItem();

    switch (monitor.getItemType()) {
      case DragDropType.SONG:
        MusicApi.addSongsToPlaylist(playlist.id, [item.song.id]);
        break;
      case DragDropType.ALBUM:
        MusicApi.addAlbumToPlaylist(playlist.id, item.album);
        break;
      case DragDropType.PLAYLIST:
        MusicApi.addPlaylistToPlaylist(playlist.id, item.playlist);
        break;
      default:
        break;
    }
  },
};

export default DropTarget(
  [DragDropType.SONG, DragDropType.ALBUM, DragDropType.PLAYLIST],
  dndSpec,
  collect
)(withRouter(PlaylistMenuItem));
