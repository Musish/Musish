import React, {Component} from 'react';

import AlbumScss from './AlbumItem.scss';

export default class AlbumItem extends Component {
  render() {
    return (
        <div className={AlbumScss.container}>
          <div className={AlbumScss.imageContainer}>
            <img src={this.props.url}
                 className={AlbumScss.image}
                 alt={'image'}/>
          </div>

          <div className={AlbumScss.descriptionContainer}>
            <h3>{this.props.title}</h3>
            <h4>{this.props.name}</h4>
          </div>
        </div>
    );
  }
}
