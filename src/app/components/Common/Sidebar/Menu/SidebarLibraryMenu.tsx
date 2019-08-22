import cx from 'classnames';
import React from 'react';
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor } from 'react-dnd';
import { addToLibrary } from '../../../../services/MusicApi';
import DragDropType from '../../../../utils/Constants/DragDropType';
import classes from '../Sidebar.scss';
import MenuItem, { MenuItemProps } from './MenuItem/MenuItem';

interface SidebarLibraryMenuProps {
  title: string;
  items: MenuItemProps[];
  connectDropTarget: ConnectDropTarget;
  isDndOver: boolean;
  activeDndItem: string | symbol | null;
}

const SidebarLibraryMenu: React.FC<SidebarLibraryMenuProps> = props => {
  const { title, items, connectDropTarget, isDndOver, activeDndItem } = props;

  return connectDropTarget(
    <div
      className={cx(
        classes.menu,
        { [classes.dndSeeking]: activeDndItem },
        { [classes.dndHovered]: isDndOver },
      )}
    >
      <h3>{title}</h3>
      <ul>
        {items.map(item => (
          <MenuItem {...item} key={item.to} />
        ))}
      </ul>
    </div>,
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
  drop(_: SidebarLibraryMenuProps, monitor: DropTargetMonitor) {
    const item = monitor.getItem();

    switch (monitor.getItemType()) {
      case DragDropType.SONG:
        addToLibrary('songs', [item.track.id]);
        break;
      case DragDropType.ALBUM:
        addToLibrary('albums', [item.album]);
        break;
      case DragDropType.PLAYLIST:
        addToLibrary('playlists', [item.playlist]);
        break;
      default:
        break;
    }
  },
};

export default DropTarget(
  [DragDropType.SONG, DragDropType.ALBUM, DragDropType.PLAYLIST],
  dndSpec,
  collect,
)(SidebarLibraryMenu);
