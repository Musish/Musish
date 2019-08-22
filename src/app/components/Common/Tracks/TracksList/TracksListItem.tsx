import * as cx from 'classnames';
import * as React from 'react';
import { ConnectDragSource, DragSource } from 'react-dnd';
import DragDropType from '../../../../utils/Constants/DragDropType';
import translate from '../../../../utils/translations/Translations';
import { getTime } from '../../../../utils/Utils';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import TrackContextMenu from '../../ContextMenu/Types/Track/TrackContextMenu';
import Loader from '../../Loader/Loader';
import TrackDecoration from './TrackDecoration';
import * as classes from './TracksListItem.scss';

interface TracksListItemProps {
  className?: string;
  connectDragSource: ConnectDragSource;
  index: number;
  playTrack: ({ track, tracks, index }: PlayTrackParams) => void;
  showAlbum?: boolean;
  showArtist?: boolean;
  style?: object;
  track: MusicKit.MediaItem;
  tracks: MusicKit.MediaItem[] | null;
}

export interface PlayTrackParams {
  track: MusicKit.MediaItem;
  tracks: MusicKit.MediaItem[];
  index: number;
}

function TracksListItem(props: TracksListItemProps) {
  const {
    showArtist,
    showAlbum,
    track,
    track: { attributes },
    connectDragSource,
    tracks,
    index,
    className = '',
    style = {},
  } = props;

  if (!tracks) {
    return <Loader />;
  }

  if (!attributes) {
    return (
      <div className={cx(classes.track, classes.disabledTrack, className)} style={style}>
        <div className={classes.trackWrapper}>
          <div className={classes.trackBacker} />
          <TrackDecoration track={track} showAlbum={showAlbum} />
          <div className={classes.trackInfo}>
            <span className={classes.trackTitle}>{translate.trackNotAvailable}</span>
          </div>
        </div>
      </div>
    );
  }

  const explicit = attributes.contentRating === 'explicit' && (
    <div className={classes.explicit}>
      <span>E</span>
    </div>
  );

  const duration = getTime(attributes.durationInMillis);

  const handleClick = async () => {
    props.playTrack({ track, tracks, index });
  };

  return connectDragSource(
    <div
      className={cx(
        {
          [classes.disabledTrack]: !attributes.playParams,
        },
        classes.track,
        className,
      )}
      onClick={handleClick}
      style={style}
    >
      <ContextMenuTrigger
        attributes={{ className: classes.trackWrapper }}
        holdToDisplay={-1}
        render={() => <TrackContextMenu track={track} tracks={tracks} index={index} />}
      >
        <div className={classes.trackBacker} />
        <TrackDecoration track={track} showAlbum={showAlbum} />
        <div className={classes.trackInfo}>
          <span className={classes.trackTitle}>
            <span className={classes.trackName}>{attributes.name}</span>
            {explicit}
          </span>
          {(showArtist || showAlbum) && (
            <span>
              {showArtist && attributes.artistName}
              {showArtist && showAlbum && ' - '}
              {showAlbum && attributes.albumName}
            </span>
          )}
        </div>
        <span className={classes.trackRightSide}>
          <span className={classes.trackDuration}>{duration}</span>
          <span
            className={classes.trackActions}
            onClick={e => {
              e.stopPropagation();
              return false;
            }}
          >
            <ContextMenuTrigger
              holdToDisplay={1}
              render={() => <TrackContextMenu track={track} tracks={tracks} index={index} />}
            >
              <i className='fas fa-ellipsis-h' />
            </ContextMenuTrigger>
          </span>
        </span>
      </ContextMenuTrigger>
    </div>,
  );
}

export default DragSource(
  DragDropType.SONG,
  {
    beginDrag(props: TracksListItemProps) {
      return {
        track: props.track,
      };
    },
  },
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  },
)(TracksListItem);
