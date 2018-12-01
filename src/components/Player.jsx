import React from 'react';
import styles from './Player.scss'

export default class Player extends React.Component {
  render() {
    return (
      <div className={styles.player}>
        <div className={styles["main-info"]}>
          <div className={styles.picture}>
            123
          </div>
          <div className={styles.track}>
            abc
          </div>
        </div>
      </div>
    );
  }
}