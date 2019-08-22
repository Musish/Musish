import cx from 'classnames';
import React from 'react';
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import DragDropType from '../../../../utils/Constants/DragDropType';
import { artworkForMediaItem } from '../../../../utils/Utils';
import { useModal } from '../../../Providers/ModalProvider';
import AlbumPanel from '../../AlbumPanel/AlbumPanel';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import AlbumContextMenu from '../../ContextMenu/Types/Album/AlbumContextMenu';
import classes from './SearchBar.scss';

interface AlbumResultItemProps {
  album: any;
  size: number;
  connectDragSource: ConnectDragSource;
}

const AlbumResultItem: React.FC<AlbumResultItemProps> = ({ album, size, connectDragSource }) => {
  const isCatalog = album.type === 'albums';

  const { push: pushModal } = useModal();

  return connectDragSource(
    <div>
      <ContextMenuTrigger holdToDisplay={-1} render={() => <AlbumContextMenu album={album} />}>
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

          <span>{album.attributes.name}</span>
        </div>
      </ContextMenuTrigger>
    </div>,
  );
};

const dndSpec = {
  beginDrag(props: AlbumResultItemProps) {
    return {
      album: props.album.id,
    };
  },
};

function dndCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.ALBUM, dndSpec, dndCollect)(AlbumResultItem);
