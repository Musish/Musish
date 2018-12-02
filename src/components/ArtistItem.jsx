import React, {Component} from 'react';

import styles from './ArtistItem.scss';
import cx from 'classnames';
import {Link} from 'react-router-dom';

export default class ArtistItem extends Component {
  render() {
    return (
        <div className={cx(styles.container)}>
          <Link to={`/artists/${this.props.artist.id}`}>
            <h1>{this.props.artist.attributes.name}</h1>
          </Link>
        </div>
    );
  }
}
