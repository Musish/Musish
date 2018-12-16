import React from 'react';
import classes from './NavigationBar.scss';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <nav className={classes.navigationBar}>
        <div className={classes.navWrapper}>
          <h1 className={classes.brand}> Musi.sh</h1>
          <div className={classes.navSearch}>
            <input type="text" placeholder="Search music" />
          </div>
        </div>
      </nav>
    )
  }
}
