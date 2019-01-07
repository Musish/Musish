import React from 'react';
import classes from './NavigationBar.scss';
import SearchBar from './Search/SearchBar';
import Logout from './Logout/Logout';

export default function NavigationBar() {
  return (
    <nav className={classes.navigationBar}>
      <h1 className={classes.brand}>Musi.sh</h1>
      <div style={{ flex: 1 }} />
      <SearchBar />
      <Logout />
    </nav>
  );
}
