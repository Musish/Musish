import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classes from './SearchBar.scss';
import useMK from '../../../../hooks/useMK';
import { createMediaItem } from '../../../../utils/Utils';
import TrackDecoration from '../../../Common/Tracks/TracksList/TrackDecoration';
import DragDropType from '../../../../utils/Constants/DragDropType';
import TrackContextMenu from '../../../Common/ContextMenu/Types/Track/TrackContextMenu';
import ContextMenuTrigger from '../../../Common/ContextMenu/ContextMenuTrigger';

function SongResultItem({ song, connectDragSource, isOver }) {
  const mk = useMK();

  const play = async () => {
    const music = mk.instance;
    await music.setQueue({
      items: [createMediaItem(song)],
    });
    await music.player.play();
  };

  const { artistName, albumName } = song.attributes;
  const isCatalog = song.type === 'songs';

  return connectDragSource(
    <div>
      <ContextMenuTrigger
        attributes={{ className: [classes.trackWrapper] }}
        holdToDisplay={-1}
        render={() => <TrackContextMenu track={song} tracks={[song]} index={0} />}
      >
        <div
          className={cx(classes.result, classes.song, { [classes.droppable]: isOver })}
          key={song.id}
          onClick={play}
        >
          <div className={classes.artwork}>
            {isCatalog && (
              <div className={classes.catalogIndicator}>
                <i className={'fab fa-apple'} />
              </div>
            )}
            <TrackDecoration track={song} showAlbum size={30} />
          </div>

          <div className={classes.detailsContainer}>
            <span className={classes.name}>{song.attributes.name}</span>
            <span className={classes.infos}>{`${artistName} - ${albumName}`}</span>
          </div>
        </div>
      </ContextMenuTrigger>
    </div>
  );
}

SongResultItem.propTypes = {
  song: PropTypes.any.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

SongResultItem.defaultProps = {
  isOver: false,
};

const dndSpec = {
  beginDrag(props) {
    return {
      track: props.track,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.SONG, dndSpec, dndCollect)(SongResultItem);
