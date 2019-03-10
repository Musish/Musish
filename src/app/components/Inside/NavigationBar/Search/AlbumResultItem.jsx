import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classes from './SearchBar.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import AlbumPanel from '../../../Common/AlbumPanel/AlbumPanel';
import ModalContext from '../../../Common/Modal/ModalContext';
import DragDropType from '../../../../utils/Constants/DragDropType';
import AlbumContextMenu from '../../../Common/ContextMenu/Types/Album/AlbumContextMenu';
import ContextMenuTrigger from '../../../Common/ContextMenu/ContextMenuTrigger';

function AlbumResultItem({ album, size, connectDragSource, isOver }) {
  const isCatalog = album.type === 'albums';

  return connectDragSource(
    <div>
      <ContextMenuTrigger
        attributes={{ className: [classes.trackWrapper] }}
        holdToDisplay={-1}
        render={() => <AlbumContextMenu album={album} />}
      >
        <ModalContext.Consumer>
          {({ push }) => (
            <div
              className={cx(classes.result, classes.album)}
              onClick={() => push(<AlbumPanel key={album.id} album={album} />)}
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
          )}
        </ModalContext.Consumer>
      </ContextMenuTrigger>
    </div>
  );
}

AlbumResultItem.propTypes = {
  album: PropTypes.any.isRequired,
  size: PropTypes.any.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

AlbumResultItem.defaultProps = {
  isOver: false,
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
