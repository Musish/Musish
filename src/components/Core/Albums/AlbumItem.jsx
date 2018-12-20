import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classes from './AlbumItem.scss';
import Modal from '../../common/Modal/Modal';
import AlbumPanel from './AlbumPanel';

class AlbumItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.renderModal = this.renderModal.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  renderModal() {
    if (!this.state.isOpen) {
      return null;
    }

    const id = this.props.id || this.props.album.id;

    return <Modal open handleClose={this.handleClose} render={() => <AlbumPanel id={id} />} />;
  }

  handleOpen() {
    if (this.props.navigate) {
      const id = this.props.id || this.props.album.id;
      this.props.history.push(`/albums/${id}`);
      return;
    }

    this.setState({ isOpen: true });
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  render() {
    const { album, size } = this.props;
    const artwork = MusicKit.formatArtworkURL(album.attributes.artwork, size, size);

    return (
      <>
        {this.renderModal()}
        <div className={classes.container} onClick={this.handleOpen} style={{ width: size }}>
          <div className={classes.imageContainer} style={{ width: size, height: size }}>
            <img
              src={artwork}
              className={classes.image}
              style={{ width: size, height: size }}
              alt={album.attributes.name}
            />
          </div>

          <div className={classes.descriptionContainer}>
            <span className={classes.albumName} style={{ width: size }}>
              {album.attributes.name}
            </span>
            <span className={classes.artistName} style={{ width: size }}>
              {album.attributes.artistName}
            </span>
          </div>
        </div>
      </>
    );
  }
}

AlbumItem.propTypes = {
  navigate: PropTypes.bool,
  album: PropTypes.any,
  id: PropTypes.any,
  history: PropTypes.any.isRequired,
  size: PropTypes.number.isRequired,
};

AlbumItem.defaultProps = {
  navigate: false,
  album: null,
  id: null,
};

export default withRouter(AlbumItem);
