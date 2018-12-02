import React, {Component} from 'react';

import styles from './ArtistItem.scss';
import cx from 'classnames'

export default class ArtistItem extends Component {
  render() {
    console.log(this.props);
    return (
      <div className={cx(styles.container)}>
        <h1>{this.props.artist.attributes.name}</h1>
      </div>
    );
  }
}
