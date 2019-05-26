import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classes from './SearchBar.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import PlaylistPanel from '../../PlaylistPanel/PlaylistPanel';
import DragDropType from '../../../../utils/Constants/DragDropType';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import PlaylistContextMenu from '../../ContextMenu/Types/Playlist/PlaylistContextMenu';
import { useModal } from '../../../Providers/ModalProvider';

function PlaylistResultItem({ playlist, size, connectDragSource }) {
  const { push: pushModal } = useModal();

  const isCatalog = playlist.type === 'playlists';

  return connectDragSource(
    <div>
      <ContextMenuTrigger
        attributes={{ className: [classes.trackWrapper] }}
        holdToDisplay={-1}
        render={() => <PlaylistContextMenu playlist={playlist} />}
      >
        <div
          className={cx(classes.result, classes.playlist)}
          onClick={() => pushModal(<PlaylistPanel playlist={playlist} pseudoRoute />)}
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
      </ContextMenuTrigger>
    </div>
  );
}

PlaylistResultItem.propTypes = {
  playlist: PropTypes.any.isRequired,
  size: PropTypes.any.isRequired,
  connectDragSource: PropTypes.func.isRequired,
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
