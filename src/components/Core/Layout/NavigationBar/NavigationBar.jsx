import React from 'react';
import css from './NavigationBar.scss';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <nav className={css.navigationBar}>
        <div className={css.navWrapper}>
          <h1 className={css.brand}> Musi.sh</h1>
          <div className={css.navSearch}>
            <input className={css.searchInput} type="text" placeholder="Search music" />
          </div>
        </div>
      </nav>
    )
  }
}
