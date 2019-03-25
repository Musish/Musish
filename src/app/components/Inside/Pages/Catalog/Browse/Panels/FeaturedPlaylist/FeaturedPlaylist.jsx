import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { DragSource } from 'react-dnd';
import cx from 'classnames';
import classes from './FeaturedAlbum.scss';
import AlbumPanel from '../../../../../../Common/AlbumPanel/AlbumPanel';
import AlbumContextMenu from '../../../../../../Common/ContextMenu/Types/Album/AlbumContextMenu';
import ContextMenuTrigger from '../../../../../../Common/ContextMenu/ContextMenuTrigger';
import ModalContext from '../../../../../../Common/Modal/ModalContext';
import DragDropType from '../../../../../../../utils/Constants/DragDropType';

class FeaturedAlbum extends Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen(replace) {
    const { id } = this.props.album;

    if (this.props.navigate) {
      this.props.history.push(`/me/albums/${id}`);
    } else {
      replace(<AlbumPanel key={id} id={id} />);
    }
  }

  render() {
    const { album, connectDragSource, isOver } = this.props;
    const artwork = MusicKit.formatArtworkURL(album.attributes.artwork, 150, 150);

    const explicit = album.attributes.contentRating === 'explicit' && (
      <div className={classes.explicit}>
        <span>E</span>
      </div>
    );

    return connectDragSource(
      <div className={cx(classes.container, { [classes.droppable]: isOver })}>
        <ModalContext.Consumer>
          {({ push }) => (
            <div onClick={() => this.handleOpen(push)}>
              <ContextMenuTrigger
                holdToDisplay={-1}
                render={() => <AlbumContextMenu album={album} />}
              >
                <div className={classes.imageContainer}>
                  <img
                    src={artwork}
                    className={classes.image}
                    alt={album.attributes.name}
                    title={album.attributes.name}
                  />
                </div>

                <div className={classes.descriptionContainer}>
                  <span className={classes.albumTitle}>
                    <div className={classes.albumName}>{album.attributes.name}</div>
                    {explicit}
                  </span>
                  <span className={classes.artistName}>
                    {album.attributes.artistName}
                  </span>
                </div>
              </ContextMenuTrigger>
            </div>
          )}
        </ModalContext.Consumer>
      </div>
    );
  }
}

FeaturedAlbum.propTypes = {
  navigate: PropTypes.bool,
  history: PropTypes.any.isRequired,
  album: PropTypes.any,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

FeaturedAlbum.defaultProps = {
  navigate: false,
  album: null,
  isOver: false,
};

const dndSpec = {
  beginDrag(props) {
    return {
      album: props.album.id,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.ALBUM, dndSpec, dndCollect)(withRouter(FeaturedAlbum));
