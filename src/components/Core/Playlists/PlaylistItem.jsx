import React, {Component} from 'react';
import PlaylistScss from "./PlaylistItem.scss";
import {Link} from 'react-router-dom';

export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: null,
    }
  }

  render() {
    return (
        <Link to={`/playlists/${this.props.id}`} className={PlaylistScss.container}>
          <div className={PlaylistScss.imageContainer}>
            <img src={this.props.url} className={PlaylistScss.image} alt={"image"}/>
          </div>

          <div className={PlaylistScss.descriptionContainer}>
            <h3>{this.props.title}</h3>
          </div>
        </Link>
    );
  }
}
