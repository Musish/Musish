import cx from 'classnames';
import React from 'react';
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import DragDropType from '../../../utils/Constants/DragDropType';
import { useModal } from '../../Providers/ModalProvider';
import AlbumPanel from '../AlbumPanel/AlbumPanel';
import ContextMenuTrigger from '../ContextMenu/ContextMenuTrigger';
import AlbumContextMenu from '../ContextMenu/Types/Album/AlbumContextMenu';
import classes from './AlbumItem.scss';

interface AlbumItemProps extends RouteComponentProps {
  navigate?: boolean;
  album?: any;
  id?: any;
  size: number;
  connectDragSource: ConnectDragSource;
  isOver?: boolean;
}

const AlbumItem: React.FC<AlbumItemProps> = (props: AlbumItemProps) => {
  const { push: pushModal } = useModal();

  function handleOpen() {
    const id = props.id || props.album.id;

    if (props.navigate) {
      props.history.push(`/me/album/${id}`);
    } else {
      pushModal(<AlbumPanel key={id} id={id} pseudoRoute />);
    }
  }

  const { album, size, connectDragSource, isOver } = props;
  let artwork;
  try {
    artwork = MusicKit.formatArtworkURL(album.attributes.artwork, size, size);
  } catch (e) {
    artwork = `https://is1-ssl.mzstatic.com/image/thumb/Features127/v4/75/f9/6f/75f96fa5-99ca-0854-3aae-8f76f5cb7fb5/source/${size}x${size}bb.jpeg`;
  }

  const explicit = album.attributes.contentRating === 'explicit' && (
    <div className={classes.explicit}>
      <span>E</span>
    </div>
  );

  return connectDragSource(
    <div className={cx(classes.container, { [classes.droppable]: isOver })} style={{ width: size }}>
      <div onClick={handleOpen}>
        <ContextMenuTrigger holdToDisplay={-1} render={() => <AlbumContextMenu album={album} />}>
          <div className={classes.imageContainer} style={{ width: size, height: size }}>
            <img
              src={artwork}
              className={classes.image}
              style={{ width: size, height: size }}
              alt={album.attributes.name}
              title={album.attributes.name}
            />
          </div>

          <div className={classes.descriptionContainer}>
            <span className={classes.albumTitle} style={{ width: size }}>
              <div className={classes.albumName}>{album.attributes.name}</div>
              {explicit}
            </span>
            <span className={classes.artistName} style={{ width: size }}>
              {album.attributes.artistName}
            </span>
          </div>
        </ContextMenuTrigger>
      </div>
    </div>,
  );
};

AlbumItem.defaultProps = {
  navigate: false,
  album: null,
  id: null,
  isOver: false,
};

const dndSpec = {
  beginDrag(props: AlbumItemProps) {
    return {
      album: props.id || props.album.id,
    };
  },
};

function dndCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.ALBUM, dndSpec, dndCollect)(withRouter(AlbumItem));
