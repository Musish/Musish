import React, {Fragment} from 'react';

export default class Layout extends React.Component {
  render() {
    return (
      <Fragment>

        <aside id="main-sidebar">
          <div class="menu">
            <ul>
              <li class="active">
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

        <main id="main-content">
          { this.props.children }
        </main>
      </Fragment>
    );
  }
}
