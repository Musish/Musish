import React, {Fragment} from 'react';
import Loader from '../../common/Loader';

import classes from './AlbumPanel.scss';
import {artworkForMediaItem, humanifyMillis} from "../common/Utils";
import SongList from "../common/SongList/SongList";

export default class AlbumsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const album = await music.api.library.album('l.PQ5aKw');

    const albumLength = album.relationships.tracks.data.reduce((a, b) => (a + b.attributes.durationInMillis), 0);

    this.setState({
      album,
      runtime: humanifyMillis(albumLength),
    });
  }

  render() {
    const {album, runtime} = this.state;
    if (!album) {
      return "Loading...";
    }
    console.log(album);
    const artworkURL = artworkForMediaItem(album, 220);
    return (
      <div className={classes.panel}>
        <div className={classes.aside}>
          <div className={classes.artworkWrapper}>
            <img src={artworkURL} />
            {album.attributes.trackCount} songs, {runtime}
          </div>
        </div>
        <div className={classes.main}>
          <span className={classes.title}>{album.attributes.name}</span>
          <span className={classes.subtitle}>{album.attributes.artistName}</span>
          <SongList songs={album.relationships.tracks.data} album={true}/>
        </div>
      </div>
    );
  }
}
