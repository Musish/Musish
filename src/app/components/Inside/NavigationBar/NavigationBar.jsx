import React from 'react';
import classes from './NavigationBar.scss';
import SearchBar from './Search/SearchBar';
import Authorize from './Authorize/Authorize';
import Settings from './Settings/Settings';

export default function NavigationBar() {
  return (
    <nav className={classes.navigationBar}>
      <h1 className={classes.brand}>
        <span className={'musicon musicon-logo'} />
        {' Musish'}
      </h1>
      <div style={{ flex: 1 }} />
      <SearchBar />
      <Settings />
      <Authorize />
    </nav>
  );
}
