import React from 'react';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <nav className="navigation-bar">
        <div className="nav-wrapper">
          <h1 className="brand"> Musi.sh</h1>
          <div className="nav-search">
            <input type="text" placeholder="Search music" />
          </div>
        </div>
      </nav>
    )
  }
}
