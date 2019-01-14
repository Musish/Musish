import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';
import MenuItem from './MenuItem';
import DragDropType from '../../../utils/Constants/DragDropType';
import { addToLibrary } from '../../../services/MusicApi';
import classes from './Sidebar.scss';

function SidebarLibraryMenu(props) {
  const { title, items, connectDropTarget, isDndOver, activeDndItem } = props;

  return connectDropTarget(
    <div
      className={cx(
        classes.menu,
        { [classes.dndSeeking]: activeDndItem },
        { [classes.dndHovered]: isDndOver }
      )}
    >
      <h3>{title}</h3>
      <ul>
        {items.map(item => (
          <MenuItem {...item} key={item.to} />
        ))}
      </ul>
    </div>
  );
}

SidebarLibraryMenu.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

function collect(connect, monitor) {
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
  drop(props, monitor) {
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
  collect
)(SidebarLibraryMenu);
