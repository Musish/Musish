import React from 'react';

export default class Sidebar extends React.Component {
  render() {
    return (
      <aside id="main-sidebar">
        <div className="menu">
          <ul>
            <li className="active">
              <a href="#">Library</a>
            </li>
            <li>
              <a href="#">Playlists</a>
            </li>
            <li>
              <a href="#">Artists</a>
            </li>
            <li>
              <a href="#">Albums</a>
            </li>
            <li>
              <a href="#">Songs</a>
            </li>
          </ul>
        </div>
      </aside>
    );
  }
}
