import React from 'react';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <h1 className="brand"> Musi.sh</h1>
          <ul className="nav-menu">
            <li className="active">
              <a href="#">Library</a>
            </li>
            <li className="">
              <a href="#">Discover</a>
            </li>
            <li className="">
              <a href="#">Social</a>
            </li>
            <li className="">
              <a href="#">Radio</a>
            </li>
          </ul>
          <div className="nav-search">
            <input type="text" placeholder="Search  Music" />
          </div>
        </div>
      </nav>
    )
  }
}
