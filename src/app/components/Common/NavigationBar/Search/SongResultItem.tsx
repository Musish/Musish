import cx from 'classnames';
import React from 'react';
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import useMK from '../../../../hooks/useMK';
import DragDropType from '../../../../utils/Constants/DragDropType';
import { createMediaItem } from '../../../../utils/Utils';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import TrackContextMenu from '../../ContextMenu/Types/Track/TrackContextMenu';
import TrackDecoration from '../../Tracks/TracksList/TrackDecoration';
import classes from './SearchBar.scss';

interface SongResultItemProps {
  song: MusicKit.MediaItem;
  connectDragSource: ConnectDragSource;
}

const SongResultItem: React.FC<SongResultItemProps> = ({ song, connectDragSource }) => {
  const mk = useMK();

  const play = async () => {
    const music = mk.instance;
    await music.setQueue({
      // @ts-ignore it works ¯\_(ツ)_/¯
      items: [createMediaItem(song)],
    });
    await music.player.play();
  };

  const { artistName, albumName } = song.attributes;
  const isCatalog = song.type === 'songs';

  return connectDragSource(
    <div>
      <ContextMenuTrigger
        holdToDisplay={-1}
        render={() => <TrackContextMenu track={song} tracks={[song]} index={0} />}
      >
        <div className={cx(classes.result, classes.song)} key={song.id} onClick={play}>
          <div className={classes.artwork}>
            {isCatalog && (
              <div className={classes.catalogIndicator}>
                <i className={'fab fa-apple'} />
              </div>
            )}
            <TrackDecoration track={song} showAlbum size={30} />
          </div>

          <div className={classes.detailsContainer}>
            <span>{song.attributes.name}</span>
            <span className={classes.infos}>{`${artistName} - ${albumName}`}</span>
          </div>
        </div>
      </ContextMenuTrigger>
    </div>,
  );
};

const dndSpec = {
  beginDrag(props: SongResultItemProps) {
    return {
      track: props.song,
    };
  },
};

function dndCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.SONG, dndSpec, dndCollect)(SongResultItem);
