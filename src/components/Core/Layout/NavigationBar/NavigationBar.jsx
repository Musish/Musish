import React from 'react';
import classes from './NavigationBar.scss';
import SearchHints from "../../Search/SearchHints";
import cx from 'classnames';

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearchClicked: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch() {
    this.setState({
      isSearchClicked: true,
    })
  }

  render() {
    const {isSearchClicked} = this.state;
    return (
      <>
        <nav className={classes.navigationBar}>
          <div className={classes.navWrapper}>
            <h1 className={classes.brand}> Musi.sh</h1>
            <div className={classes.navSearch}>
              <div className={classes.searchWrapper}>
                <input className={classes.searchInput} type="text" placeholder="Search Music" onClick={this.handleSearch}/>
                <SearchHints className={cx(classes.searchHints, {[classes.showSearchHints]: isSearchClicked})} />
              </div>
            </div>
          </div>
        </nav>
      </>
    )
  }
}
