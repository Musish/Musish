import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classes from './SearchBar.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import AlbumPanel from '../../AlbumPanel/AlbumPanel';
import DragDropType from '../../../../utils/Constants/DragDropType';
import AlbumContextMenu from '../../ContextMenu/Types/Album/AlbumContextMenu';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import { useModal } from '../../../Providers/ModalProvider';

function AlbumResultItem({ album, size, connectDragSource }) {
  const isCatalog = album.type === 'albums';

  const { push: pushModal } = useModal();

  return connectDragSource(
    <div>
      <ContextMenuTrigger
        attributes={{ className: [classes.trackWrapper] }}
        holdToDisplay={-1}
        render={() => <AlbumContextMenu album={album} />}
      >
        <div
          className={cx(classes.result, classes.album)}
          onClick={() => pushModal(<AlbumPanel key={album.id} album={album} pseudoRoute />)}
        >
          <span className={classes.artwork}>
            {isCatalog && (
              <div className={classes.catalogIndicator}>
                <i className={'fab fa-apple'} />
              </div>
            )}
            <img
              src={artworkForMediaItem(album, size)}
              alt={album.attributes.name}
              style={{ width: size, height: size }}
            />
          </span>

          <span className={classes.name}>{album.attributes.name}</span>
        </div>
      </ContextMenuTrigger>
    </div>
  );
}

AlbumResultItem.propTypes = {
  album: PropTypes.any.isRequired,
  size: PropTypes.any.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

const dndSpec = {
  beginDrag(props) {
    return {
      album: props.id || props.album.id,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.ALBUM, dndSpec, dndCollect)(AlbumResultItem);
