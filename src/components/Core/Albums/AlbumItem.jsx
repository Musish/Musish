import React, {Component} from 'react';

import classes from './AlbumItem.scss';
import {Link} from 'react-router-dom';

export default class AlbumItem extends Component {
  render() {
    const {album, size} = this.props;
    const artwork = MusicKit.formatArtworkURL(album.attributes.artwork, size, size);
    return (
        <Link to={`/albums/${album.id}`} className={classes.container}>
          <div className={classes.imageContainer} style={{width: size}}>
            <img
              src={artwork}
              className={classes.image}
              style={{width: size, height: size}}
            />
          </div>

          <div className={classes.descriptionContainer}>
            <span className={classes.albumName}  style={{width: size}}>
              {album.attributes.name}
            </span>
            <span className={classes.artistName} style={{width: size}}>
              {album.attributes.artistName}</span>
          </div>
        </Link>
    );
  }
}
