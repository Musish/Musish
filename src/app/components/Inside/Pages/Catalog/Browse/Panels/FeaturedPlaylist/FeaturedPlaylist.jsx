import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import classes from './FeaturedPlaylist.scss';
import PlaylistPanel from '../../../../../../Common/PlaylistPanel/PlaylistPanel';
import ModalContext from '../../../../../../Common/Modal/ModalContext';
import ContextMenuTrigger from '../../../../../../Common/ContextMenu/ContextMenuTrigger';
import PlaylistContextMenu from '../../../../../../Common/ContextMenu/Types/Playlist/PlaylistContextMenu';
import DragDropType from '../../../../../../../utils/Constants/DragDropType';

class FeaturedPlaylist extends Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen(push) {
    const id = this.props.id || this.props.playlist.id;
    if (this.props.navigate) {
      this.props.history.push(`/playlists/${id}`);
      return;
    }

    push(<PlaylistPanel id={id} />);
  }

  render() {
    const { playlist, connectDragSource, isOver } = this.props;

    const coverArtwork = MusicKit.formatArtworkURL(
      playlist.attributes.editorialArtwork.subscriptionHero,
      240,
      416
    ).replace('{c}', 'sr');
    const coverArtworkBackgroundColor =
      playlist.attributes.editorialArtwork.subscriptionHero.bgColor;

    const caption = playlist.attributes.description.short;

    return connectDragSource(
      <div className={cx(classes.container, { [classes.droppable]: isOver })}>
        <ModalContext.Consumer>
          {({ push }) => (
            <div onClick={() => this.handleOpen(push)}>
              <ContextMenuTrigger
                holdToDisplay={-1}
                render={() => <PlaylistContextMenu playlist={playlist} />}
              >
                <div className={classes.descriptionContainer}>
                  <span className={classes.featureTag}>{playlist.tag}</span>
                  <span className={classes.playlistName}>{playlist.attributes.name}</span>
                </div>

                <div className={classes.coverContainer}>
                  <img
                    src={coverArtwork}
                    className={classes.cover}
                    alt={playlist.attributes.name}
                    title={playlist.attributes.name}
                    style={{ background: `#${coverArtworkBackgroundColor}` }}
                  />
                  <div className={classes.detailsOverlay}>
                    <p className={classes.caption}>{caption}</p>
                  </div>
                </div>
              </ContextMenuTrigger>
            </div>
          )}
        </ModalContext.Consumer>
      </div>
    );
  }
}

FeaturedPlaylist.propTypes = {
  navigate: PropTypes.bool,
  history: PropTypes.any.isRequired,
  playlist: PropTypes.any,
  id: PropTypes.any,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

FeaturedPlaylist.defaultProps = {
  navigate: false,
  playlist: null,
  id: null,
  isOver: false,
};

const dndSpec = {
  beginDrag(props) {
    return {
      playlist: props.id || props.playlist.id,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.PLAYLIST, dndSpec, dndCollect)(withRouter(FeaturedPlaylist));
