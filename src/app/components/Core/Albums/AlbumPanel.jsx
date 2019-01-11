import React from 'react';

import PropTypes from 'prop-types';
import classes from './AlbumPanel.scss';
import { artworkForMediaItem, humanifyMillis } from '../../../utils/Utils';
import SongList from '../Songs/SongList/SongList';
import Loader from '../../common/Loader';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';
import * as MusicApi from '../../../services/MusicApi';

export default class AlbumPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: this.props.album,
    };

    this.ref = React.createRef();
    this.store = {};

    this.playSong = this.playSong.bind(this);
    this.playAlbum = this.playAlbum.bind(this);
    this.shuffleAlbum = this.shuffleAlbum.bind(this);
    this.onSetItems = this.onSetItems.bind(this);
  }

  getAlbumId() {
    return this.props.id || this.props.album.id;
  }

  onSetItems({ items }) {
    const playlistLength = items.reduce(
      (totalDuration, track) =>
        totalDuration + track.attributes ? track.attributes.durationInMillis : 0,
      0
    );

    this.setState({
      runtime: humanifyMillis(playlistLength),
    });
  }

  playSong({ index }) {
    MusicPlayerApi.playAlbum(this.state.album, index);
  }

  async playAlbum(index = 0) {
    MusicPlayerApi.playAlbum(this.state.album, index);
  }

  async shuffleAlbum() {
    const randy = Math.floor(Math.random() * this.state.album.relationships.tracks.data.length);
    await this.playAlbum(randy);
    MusicPlayerApi.shuffle();
  }

  render() {
    const { album, runtime } = this.state;

    if (!album) {
      return <Loader />;
    }

    const music = MusicKit.getInstance();
    const functionGenerator = (...args) =>
      isNaN(this.getAlbumId()) ? music.api.library.album(...args) : music.api.album(...args);

    const artworkURL = artworkForMediaItem(album, 220);

    const explicit = album.attributes.contentRating === 'explicit' && (
      <div className={classes.explicit}>
        <span>
          <span>E</span>
        </span>
      </div>
    );

    return (
      <div className={classes.panel} ref={this.ref}>
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
            {`${album.attributes.trackCount} songs, ${runtime}`}
          </span>
        </div>

        <div className={classes.main}>
          <span className={classes.title}>
            <span className={classes.name}>{album.attributes.name}</span>
            {explicit}
          </span>

          <span className={classes.subtitle}>{album.attributes.artistName}</span>
          <SongList
            scrollElement={this.ref}
            scrollElementModifier={e => e && e.parentElement}
            load={MusicApi.infiniteLoadRelationships(
              this.getAlbumId(),
              functionGenerator,
              'tracks',
              this.store
            )}
            onSetItems={this.onSetItems}
            playSong={this.playSong}
          />
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
