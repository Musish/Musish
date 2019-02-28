import React from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import { DragSource } from 'react-dnd';
import { getTime } from '../../../../utils/Utils';
import classes from './TracksListItem.scss';
import TrackDecoration from './TrackDecoration';
import DragDropType from '../../../../utils/Constants/DragDropType';
import ContextMenuTrigger from '../../ContextMenu/ContextMenuTrigger';
import TrackContextMenu from '../../ContextMenu/Types/Track/TrackContextMenu';
import { isTrackPlaying } from '../../../../services/MusicPlayerApi';
import translate from '../../../../utils/translations/Translations';

class TracksListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    const { track, tracks, index } = this.props;

    this.props.playTrack({ track, tracks, index });
  }

  render() {
    const {
      showArtist,
      showAlbum,
      track,
      connectDragSource,
      isOver,
      tracks,
      index,
      className,
    } = this.props;
    const { attributes } = track;

    if (!attributes) {
      return (
        <div
          className={cx(classes.track, classes.disabledTrack, className)}
          style={this.props.style}
        >
          <div className={[classes.trackWrapper]}>
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
            [classes.indexedTrack]: !showAlbum,
            [classes.playing]: isTrackPlaying(track),
            [classes.droppable]: isOver,
            [classes.disabledTrack]: !track.attributes.playParams,
          },
          classes.track,
          className
        )}
        onClick={this.handleClick}
        style={this.props.style}
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
              <span className={classes.trackMetaInfo}>
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
                <i className="fas fa-ellipsis-h" />
              </ContextMenuTrigger>
            </span>
          </span>
        </ContextMenuTrigger>
      </div>
    );
  }
}

TracksListItem.propTypes = {
  track: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  tracks: PropTypes.array.isRequired,
  style: PropTypes.object,
  showArtist: PropTypes.bool.isRequired,
  showAlbum: PropTypes.bool.isRequired,
  playTrack: PropTypes.func.isRequired,
  className: PropTypes.any,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

TracksListItem.defaultProps = {
  style: {},
  isOver: false,
  className: null,
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
