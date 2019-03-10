import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classes from './SearchBar.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import ModalContext from '../../../Common/Modal/ModalContext';
import PlaylistPanel from '../../../Common/PlaylistPanel/PlaylistPanel';
import DragDropType from '../../../../utils/Constants/DragDropType';
import ContextMenuTrigger from '../../../Common/ContextMenu/ContextMenuTrigger';
import PlaylistContextMenu from '../../../Common/ContextMenu/Types/Playlist/PlaylistContextMenu';

function PlaylistResultItem({ playlist, size, connectDragSource, isOver }) {
  const isCatalog = playlist.type === 'playlists';

  return connectDragSource(
    <div>
      <ContextMenuTrigger
        attributes={{ className: [classes.trackWrapper] }}
        holdToDisplay={-1}
        render={() => <PlaylistContextMenu playlist={playlist} />}
      >
        <ModalContext.Consumer>
          {({ push }) => (
            <div
              className={cx(classes.result, classes.playlist)}
              onClick={() => push(<PlaylistPanel playlist={playlist} />)}
            >
              <span className={classes.artwork}>
                {isCatalog && (
                  <div className={classes.catalogIndicator}>
                    <i className={'fab fa-apple'} />
                  </div>
                )}
                <img
                  src={artworkForMediaItem(playlist, size)}
                  alt={playlist.attributes.name}
                  style={{ width: size, height: size }}
                />
              </span>

              <span className={classes.name}>{playlist.attributes.name}</span>
            </div>
          )}
        </ModalContext.Consumer>
      </ContextMenuTrigger>
    </div>
  );
}

PlaylistResultItem.propTypes = {
  playlist: PropTypes.any.isRequired,
  size: PropTypes.any.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

PlaylistResultItem.defaultProps = {
  isOver: false,
};

const dndSpec = {
  beginDrag(props) {
    return {
      playlist: props.id || props.playlist.id,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.PLAYLIST, dndSpec, dndCollect)(PlaylistResultItem);
