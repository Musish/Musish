import React from 'react';
import css from './NavigationBar.scss';

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch() {

  }

  render() {
    return (
      <nav className={css.navigationBar}>
        <div className={css.navWrapper}>
          <h1 className={css.brand}> Musi.sh</h1>
          <div className={css.navSearch}>
            <input className={css.searchInput} type="text" placeholder="Search Music" onClick={this.handleSearch}/>
          </div>
        </div>
      </nav>
    )
  }
}
