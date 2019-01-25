import React from 'react';
import classes from './NavigationBar.scss';
import SearchBar from './Search/SearchBar';
import Authorize from './Authorize/Authorize';

export default function NavigationBar() {
  return (
    <nav className={classes.navigationBar}>
      <div style={{ flex: 1 }} />
      <SearchBar />
      <Authorize />
    </nav>
  );
}
