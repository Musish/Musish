import React from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import { DragSource } from 'react-dnd';
import { createMediaItem, isPlaying, getTime } from '../../../../utils/Utils';
import classes from './SongList.scss';
import withMK from '../../../../hoc/withMK';
import SongDecoration from './SongDecoration';
import DragDropType from '../../../../utils/Constants/DragDropType';
import ContextMenuTrigger from '../../../common/ContextMenu/ContextMenuTrigger';
import SongContextMenu from './SongContextMenu';

class SongListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  async playSong() {
    const music = this.props.mk.instance;
    await music.setQueue({
      startPosition: this.props.index,
      items: this.props.songs.map(song => createMediaItem(song)),
    });
    await music.player.play();
  }

  async pauseSong() {
    await this.props.mk.instance.player.pause();
  }

  async handleClick() {
    if (this.isPlaying()) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  isPlaying() {
    const { song } = this.props;

    return isPlaying(song);
  }

  renderDecoration() {
    const { showAlbum, song } = this.props;

    return <SongDecoration song={song} showAlbum={showAlbum} />;
  }

  render() {
    const { showArtist, showAlbum, song, connectDragSource, isOver, songs, index } = this.props;
    const { attributes } = song;

    if (!attributes) {
      return (
        <div className={cx(classes.song)} style={this.props.style}>
          <div className={[classes.songWrapper]}>
            <div className={classes.songBacker} />
            {this.renderDecoration()}
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
            [classes.playing]: this.isPlaying(),
            [classes.droppable]: isOver,
          },
          classes.song
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
          {this.renderDecoration()}
          <div className={classes.songInfo}>
            <span className={classes.songTitle}>
              {attributes.name}
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
          <span className={classes.songDuration}>
            <span>{duration}</span>
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
  mk: PropTypes.any.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

SongListItem.defaultProps = {
  style: {},
  isOver: false,
};

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
  [MusicKit.Events.playbackStateDidChange]: 'playbackState',
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

export default DragSource(DragDropType.SONG, dndSpec, dndCollect)(withMK(SongListItem, bindings));
