import cx from 'classnames';
import React from 'react';
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import DragDropType from '../../../utils/Constants/DragDropType';
import { artworkForMediaItem } from '../../../utils/Utils';
import { useModal } from '../../Providers/ModalProvider';
import ContextMenuTrigger from '../ContextMenu/ContextMenuTrigger';
import PlaylistContextMenu from '../ContextMenu/Types/Playlist/PlaylistContextMenu';
import PlaylistPanel from '../PlaylistPanel/PlaylistPanel';
import classes from './PlaylistItem.scss';

interface PlaylistItemProps extends RouteComponentProps {
  navigate?: boolean;
  history: any;
  playlist?: any;
  id?: any;
  size: number;
  connectDragSource: ConnectDragSource;
  isOver?: boolean;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  connectDragSource,
  history,
  id,
  isOver = false,
  navigate = false,
  playlist,
  size,
}) => {
  const { push: pushModal } = useModal();

  function handleOpen() {
    const playlistId = id || playlist.id;

    if (navigate) {
      history.push(`/playlists/${playlistId}`);
      return;
    }

    pushModal(<PlaylistPanel id={playlistId} pseudoRoute />);
  }

  const artwork = artworkForMediaItem(playlist, size);

  return connectDragSource(
    <div className={cx(classes.container, { [classes.droppable]: isOver })} style={{ width: size }}>
      <div onClick={handleOpen}>
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
    </div>,
  );
};

const dndSpec = {
  beginDrag(props: PlaylistItemProps) {
    return {
      playlist: props.id || props.playlist.id,
    };
  },
};

function dndCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.PLAYLIST, dndSpec, dndCollect)(withRouter(PlaylistItem));
