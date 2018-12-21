import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classes from './AlbumItem.scss';
import AlbumPanel from './AlbumPanel';
import ModalContext from '../../common/Modal/ModalContext';

class AlbumItem extends Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen(push) {
    const id = this.props.id || this.props.album.id;

    if (this.props.navigate) {
      this.props.history.push(`/albums/${id}`);
    } else {
      push(<AlbumPanel id={id} />);
    }
  }

  render() {
    const { album, size } = this.props;
    const artwork = MusicKit.formatArtworkURL(album.attributes.artwork, size, size);

    return (
      <ModalContext.Consumer>
        {({ push }) => (
          <>
            <div
              className={classes.container}
              onClick={() => this.handleOpen(push)}
              style={{ width: size }}
            >
              <div className={classes.imageContainer} style={{ width: size, height: size }}>
                <img
                  src={artwork}
                  className={classes.image}
                  style={{ width: size, height: size }}
                  alt={album.attributes.name}
                  title={album.attributes.name}
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
        )}
      </ModalContext.Consumer>
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
