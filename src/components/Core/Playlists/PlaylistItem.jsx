import React, {Component} from 'react';
import classes from "./PlaylistItem.scss";
import {Link} from 'react-router-dom';

export default class PlaylistItem extends Component {
  render() {
    const {playlist, size} = this.props;
    const artwork = MusicKit.formatArtworkURL(playlist.attributes.artwork, size, size);

    return (
        <Link to={`/playlists/${playlist.id}`} className={classes.container} style={{width: size}}>
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
        </Link>
    );
  }
}
