import React, {Component} from 'react';

import classes from "./PlaylistItem.scss";
import Modal from "../../common/Modal/Modal";
import PlaylistPanel from "./PlaylistPanel";

export default class PlaylistItem extends Component {
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

    return (
      <Modal open={true} handleClose={this.handleClose} render={() => (
        <PlaylistPanel id={id}/>
      )}/>
    );
  }

  handleOpen() {
    if (this.props.navigate) {
      const id = this.props.id || this.props.album.id;
      this.props.history.push(`/albums/${id}`);
      return;
    }

    this.setState({isOpen: true});
  }

  handleClose() {
    this.setState({isOpen: false});
  }

  render() {
    const {playlist, size} = this.props;
    const artwork = MusicKit.formatArtworkURL(playlist.attributes.artwork, size, size);
    return (
      <>
        {this.renderModal()}
        <div className={classes.container} onClick={this.handleOpen} style={{width: size}}>
          <div className={classes.imageContainer} style={{width: size, height: size}}>
            <img
              src={artwork}
              className={classes.image}
              style={{width: size, height: size}}
            />
          </div>

          <div className={classes.descriptionContainer}>
              <span className={classes.playlistName} style={{width: size}}>
                {playlist.attributes.name}
              </span>
          </div>
        </div>
      </>
    );
  }
}
