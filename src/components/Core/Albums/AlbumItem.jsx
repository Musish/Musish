import React, {Component} from 'react';

import Classes from './AlbumItem.scss';
import {Link} from 'react-router-dom';

export default class AlbumItem extends Component {
  render() {
    return (
        <Link to={`/albums/${this.props.id}`} className={Classes.container}>
          <div className={Classes.imageContainer}>
            <img
              src={this.props.url}
              className={Classes.image}
            />
          </div>

          <div className={Classes.descriptionContainer}>
            <span className={Classes.albumName}>{this.props.title}</span>
            <span className={Classes.artistName}>{this.props.name}</span>
          </div>
        </Link>
    );
  }
}
