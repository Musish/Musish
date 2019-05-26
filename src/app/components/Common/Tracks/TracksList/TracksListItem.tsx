import * as cx from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { DragSource } from 'react-dnd';
import DragDropType from '../../../../utils/Constants/DragDropType';
import translate from '../../../../utils/translations/Translations';
import { getTime } from '../../../../utils/Utils';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import TrackContextMenu from '../../ContextMenu/Types/Track/TrackContextMenu';
import TrackDecoration from './TrackDecoration';
import * as classes from './TracksListItem.scss';

function TracksListItem(props) {
  const {
    showArtist,
    showAlbum,
    track,
    track: { attributes },
    connectDragSource,
    tracks,
    index,
    className,
  } = props;

  async function handleClick() {
    props.playTrack({ track, tracks, index });
  }

  if (!attributes) {
    return (
      <div className={cx(classes.track, classes.disabledTrack, className)} style={props.style}>
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

  return connectDragSource(
    <div
      className={cx(
        {
          [classes.disabledTrack]: !track.attributes.playParams,
        },
        classes.track,
        className,
      )}
      onClick={handleClick}
      style={props.style}
    >
      <ContextMenuTrigger
        attributes={{ className: [classes.trackWrapper] }}
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
            onClick={(e) => {
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

TracksListItem.propTypes = {
  className: PropTypes.any,
  connectDragSource: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  playTrack: PropTypes.func.isRequired,
  showAlbum: PropTypes.bool.isRequired,
  showArtist: PropTypes.bool.isRequired,
  style: PropTypes.object,
  track: PropTypes.any.isRequired,
  tracks: PropTypes.array.isRequired,
};

TracksListItem.defaultProps = {
  className: null,
  style: {},
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

export default DragSource(DragDropType.SONG, dndSpec, dndCollect)(TracksListItem);
