import React from 'react';
import classes from './NavigationBar.scss';
import SearchBar from "./Search/SearchBar";

export default class NavigationBar extends React.Component {
  render() {
    return (
      <nav className={classes.navigationBar}>
        <h1 className={classes.brand}> Musi.sh</h1>
        <div style={{flex: 1}} />
        <SearchBar />
      </nav>
    )
  }
}
