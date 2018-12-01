import React from 'react';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <nav>
        <div class="nav-wrapper">
          <h1 class="brand"> Musi.sh</h1>
          <ul class="nav-menu">
            <li class="active">
              <a href="#">Library</a>
            </li>
            <li class="">
              <a href="#">Discover</a>
            </li>
            <li class="">
              <a href="#">Social</a>
            </li>
            <li class="">
              <a href="#">Radio</a>
            </li>
          </ul>
          <div class="nav-search">
            <input type="text" placeholder="Search  Music" />
          </div>
        </div>
      </nav>
    )
  }
}
