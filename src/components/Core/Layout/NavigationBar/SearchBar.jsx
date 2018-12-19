import React from 'react';
import classes from "./SearchBar.scss";

class SearchBar extends React.Component {
  render() {
    return (
      <div className={classes.navSearch}>
        <input type="text" placeholder="Search music" />
      </div>
    )
  }
}

export default SearchBar;
