import React from 'react';

import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import classes from './PlaylistItem.scss';
import PlaylistPanel from '../PlaylistPanel/PlaylistPanel';
import { artworkForMediaItem } from '../../../utils/Utils';
import DragDropType from '../../../utils/Constants/DragDropType';
import ModalContext from '../Modal/ModalContext';
import ContextMenuTrigger from '../ContextMenu/ContextMenuTrigger';
import PlaylistContextMenu from '../ContextMenu/Types/Playlist/PlaylistContextMenu';

function PlaylistItem(props) {
  function handleOpen(push) {
    const id = props.id || props.playlist.id;
    if (props.navigate) {
      props.history.push(`/playlists/${id}`);
      return;
    }

    push(<PlaylistPanel id={id} />);
  }

  const { playlist, size, connectDragSource, isOver } = props;
  const artwork = artworkForMediaItem(playlist, size);

  return connectDragSource(
    <div className={cx(classes.container, { [classes.droppable]: isOver })} style={{ width: size }}>
      <ModalContext.Consumer>
        {({ push }) => (
          <div onClick={() => handleOpen(push)}>
            <ContextMenuTrigger
              holdToDisplay={-1}
              render={() => <PlaylistContextMenu playlist={playlist} />}
            >
              <div className={classes.imageContainer} style={{ width: size, height: size }}>
                <img
                  src={artwork}
                  className={classes.image}
                  style={{ width: size, height: size }}
                  alt={playlist.attributes.name}
                  title={playlist.attributes.name}
                />
              </div>

              <div className={classes.descriptionContainer}>
                <span className={classes.playlistName} style={{ width: size }}>
                  {playlist.attributes.name}
                </span>
              </div>
            </ContextMenuTrigger>
          </div>
        )}
      </ModalContext.Consumer>
    </div>
  );
}

PlaylistItem.propTypes = {
  navigate: PropTypes.bool,
  history: PropTypes.any.isRequired,
  playlist: PropTypes.any,
  id: PropTypes.any,
  size: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

PlaylistItem.defaultProps = {
  navigate: false,
  playlist: null,
  id: null,
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

export default DragSource(DragDropType.PLAYLIST, dndSpec, dndCollect)(withRouter(PlaylistItem));
