import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import classes from './NavigationBar.scss';
import SearchBar from './Search/SearchBar';
import Authorize from './Authorize/Authorize';
import Settings from './Settings/Settings';

export default function NavigationBar() {
  return (
    <nav className={classes.navigationBar}>
      <h1 className={classes.brand}>
        <Link to="/">
          <span className={cx(classes.icon, 'musicon musicon-logo')} />
          <span className={classes.name}>Musish</span>
        </Link>
      </h1>
      <div style={{ flex: 1 }} />
      <SearchBar />
      <Settings />
      <Authorize />
    </nav>
  );
}
