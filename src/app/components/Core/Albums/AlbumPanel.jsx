import React from 'react';

import PropTypes from 'prop-types';
import classes from './AlbumPanel.scss';
import { artworkForMediaItem, humanifyMillis } from '../../../utils/Utils';
import SongList from '../Songs/SongList/SongList';
import Loader from '../../common/Loader';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';

export default class AlbumPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: this.props.album,
    };

    this.ref = React.createRef();

    this.playSong = this.playSong.bind(this);
    this.playAlbum = this.playAlbum.bind(this);
    this.shuffleAlbum = this.shuffleAlbum.bind(this);
  }

  async componentDidMount() {
    const albumId = this.props.id || this.props.album.id;
    const music = MusicKit.getInstance();
    const album = isNaN(albumId)
      ? await music.api.library.album(albumId)
      : await music.api.album(albumId);

    const albumLength = album.relationships.tracks.data.reduce(
      (totalDuration, track) => totalDuration + track.attributes.durationInMillis,
      0
    );

    this.setState({
      album,
      runtime: humanifyMillis(albumLength),
    });
  }

  playSong({ index }) {
    MusicPlayerApi.playAlbum(this.state.album, index);
  }

  playAlbum(index = 0) {
    MusicPlayerApi.playAlbum(this.state.album, index);
  }

  shuffleAlbum() {
    const randy = Math.floor(Math.random() * this.state.album.relationships.tracks.data.length);
    this.playAlbum(randy);
    MusicPlayerApi.shuffle();
  }

  render() {
    const { album, runtime } = this.state;

    if (!album) {
      return <Loader />;
    }

    const artworkURL = artworkForMediaItem(album, 220);

    return (
      <div className={classes.panel}>
        <div className={classes.aside}>
          <div className={classes.artworkWrapper}>
            <img src={artworkURL} alt={album.attributes.name} />
          </div>
          <div className={classes.playActions}>
            <button type={'button'} onClick={this.playAlbum} className={classes.button}>
              <i className={`${classes.icon} fas fa-play`} />
              Play
            </button>
            <button type={'button'} onClick={this.shuffleAlbum} className={classes.button}>
              <i className={`${classes.icon} fas fa-random`} />
              Shuffle
            </button>
          </div>
          <span className={classes.albumRuntimeDescription}>
            {album.attributes.trackCount}
            songs,
            {runtime}
          </span>
        </div>
        <div className={classes.main} ref={this.ref}>
          <span className={classes.title}>{album.attributes.name}</span>
          <span className={classes.subtitle}>{album.attributes.artistName}</span>
          {album.relationships ? (
            <SongList
              scrollElement={this.ref}
              load={() => album.relationships.tracks.data}
              playSong={this.playSong}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    );
  }
}

AlbumPanel.propTypes = {
  id: PropTypes.any,
  album: PropTypes.any,
};

AlbumPanel.defaultProps = {
  id: null,
  album: null,
};
