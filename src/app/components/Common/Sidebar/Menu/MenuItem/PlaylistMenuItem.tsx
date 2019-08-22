import cx from 'classnames';
import React from 'react';
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor } from 'react-dnd';
import { Link, Route } from 'react-router-dom';
import * as MusicApi from '../../../../../services/MusicApi';
import DragDropType from '../../../../../utils/Constants/DragDropType';
import classes from '../../Sidebar.scss';

interface PlaylistMenuItemProps {
  playlist: any;
  connectDropTarget: ConnectDropTarget;
  isDndOver: boolean;
  activeDndItem: string | symbol | null;
}

const PlaylistMenuItem: React.FC<PlaylistMenuItemProps> = ({
  playlist,
  connectDropTarget,
  isDndOver,
  activeDndItem,
}: PlaylistMenuItemProps) => {
  const to = `/me/playlist/${playlist.id}`;

  return connectDropTarget(
    <li>
      <Route path={to} exact>
        {({ match }) => (
          <Link
            to={to}
            className={cx(
              { [classes.active]: !!match },
              { [classes.dndSeeking]: activeDndItem },
              { [classes.dndHovered]: isDndOver },
            )}
          >
            {playlist.attributes.name}
          </Link>
        )}
      </Route>
    </li>,
  );
};

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isDndOver: monitor.isOver(),
    activeDndItem: monitor.getItemType(),
  };
}

const dndSpec = {
  canDrop() {
    return true;
  },
  drop(props: PlaylistMenuItemProps, monitor: DropTargetMonitor) {
    const { playlist } = props;
    const item = monitor.getItem();

    switch (monitor.getItemType()) {
      case DragDropType.SONG:
        MusicApi.addSongsToPlaylist(playlist.id, [item.track]);
        break;
      case DragDropType.ALBUM:
        MusicApi.addAlbumToPlaylist(playlist.id, item.album);
        break;
      case DragDropType.PLAYLIST:
        MusicApi.addPlaylistToPlaylist(playlist.id, item.playlist);
        break;
    }
  },
};

export default DropTarget(
  [DragDropType.SONG, DragDropType.ALBUM, DragDropType.PLAYLIST],
  dndSpec,
  collect,
)(PlaylistMenuItem);
