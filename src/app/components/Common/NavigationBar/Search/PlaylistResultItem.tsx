import cx from 'classnames';
import React from 'react';
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import DragDropType from '../../../../utils/Constants/DragDropType';
import { artworkForMediaItem } from '../../../../utils/Utils';
import { useModal } from '../../../Providers/ModalProvider';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import PlaylistContextMenu from '../../ContextMenu/Types/Playlist/PlaylistContextMenu';
import PlaylistPanel from '../../PlaylistPanel/PlaylistPanel';
import classes from './SearchBar.scss';

interface PlaylistResultItemProps {
  playlist: any;
  size: number;
  connectDragSource: ConnectDragSource;
}

const PlaylistResultItem: React.FC<PlaylistResultItemProps> = ({
  playlist,
  size,
  connectDragSource,
}) => {
  const { push: pushModal } = useModal();

  const isCatalog = playlist.type === 'playlists';

  return connectDragSource(
    <div>
      <ContextMenuTrigger
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

          <span>{playlist.attributes.name}</span>
        </div>
      </ContextMenuTrigger>
    </div>,
  );
};

const dndSpec = {
  beginDrag(props: PlaylistResultItemProps) {
    return {
      playlist: props.playlist.id,
    };
  },
};

function dndCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.PLAYLIST, dndSpec, dndCollect)(PlaylistResultItem);
