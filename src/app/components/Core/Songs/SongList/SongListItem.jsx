import React from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import { DragSource } from 'react-dnd';
import { getTime } from '../../../../utils/Utils';
import classes from './SongListItem.scss';
import SongDecoration from './SongDecoration';
import DragDropType from '../../../../utils/Constants/DragDropType';
import ContextMenuTrigger from '../../../common/ContextMenu/ContextMenuTrigger';
import SongContextMenu from './SongContextMenu';
import { isSongPlaying } from '../../../../services/MusicPlayerApi';

class SongListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    const { song, songs, index } = this.props;

    this.props.playSong({ song, songs, index });
  }

  render() {
    const {
      showArtist,
      showAlbum,
      song,
      connectDragSource,
      isOver,
      songs,
      index,
      className,
    } = this.props;
    const { attributes } = song;

    if (!attributes) {
      return (
        <div className={cx(classes.song, classes.disabledSong, className)} style={this.props.style}>
          <div className={[classes.songWrapper]}>
            <div className={classes.songBacker} />
            <SongDecoration song={song} showAlbum={showAlbum} />
            <div className={classes.songInfo}>
              <span className={classes.songTitle}>{'Song not available'}</span>
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
            [classes.indexedSong]: !showAlbum,
            [classes.playing]: isSongPlaying(song),
            [classes.droppable]: isOver,
            [classes.disabledSong]: !song.attributes.playParams,
          },
          classes.song,
          className
        )}
        onClick={this.handleClick}
        style={this.props.style}
      >
        <ContextMenuTrigger
          attributes={{ className: [classes.songWrapper] }}
          holdToDisplay={-1}
          render={() => <SongContextMenu song={song} songs={songs} index={index} />}
        >
          <div className={classes.songBacker} />
          <SongDecoration song={song} showAlbum={showAlbum} />
          <div className={classes.songInfo}>
            <span className={classes.songTitle}>
              <span className={classes.songName}>{attributes.name}</span>
              {explicit}
            </span>
            {(showArtist || showAlbum) && (
              <span className={classes.songMetaInfo}>
                {showArtist && attributes.artistName}
                {showArtist && showAlbum && ' - '}
                {showAlbum && attributes.albumName}
              </span>
            )}
          </div>
          <span className={classes.songRightSide}>
            <span className={classes.songDuration}>{duration}</span>
            <span
              className={classes.songActions}
              onClick={e => {
                e.stopPropagation();
                return false;
              }}
            >
              <ContextMenuTrigger
                holdToDisplay={1}
                render={() => <SongContextMenu song={song} songs={songs} index={index} />}
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

SongListItem.propTypes = {
  song: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  songs: PropTypes.array.isRequired,
  style: PropTypes.object,
  showArtist: PropTypes.bool.isRequired,
  showAlbum: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
  playSong: PropTypes.func.isRequired,
  className: PropTypes.any,
};

SongListItem.defaultProps = {
  style: {},
  isOver: false,
  className: null,
};

const dndSpec = {
  beginDrag(props) {
    return {
      song: props.song,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.SONG, dndSpec, dndCollect)(SongListItem);
