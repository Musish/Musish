import React from 'react';

import PropTypes from 'prop-types';
import classes from './PlaylistPanel.scss';
import { artworkForMediaItem, humanifyMillis } from '../common/Utils';
import SongList from '../common/SongList/SongList';
import Loader from '../../common/Loader';

export default class PlaylistPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: this.props.playlist,
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const playlistId = this.props.id || this.props.playlist;
    if (playlistId) {
      const isLibrary = playlistId.startsWith('p.');
      const music = MusicKit.getInstance();
      const playlist = isLibrary
        ? await music.api.library.playlist(playlistId)
        : await music.api.playlist(playlistId);

      const albumLength = playlist.relationships.tracks.data.reduce(
        (totalDuration, track) => totalDuration + track.attributes.durationInMillis,
        0
      );

      this.setState({
        playlist,
        runtime: humanifyMillis(albumLength),
        isLibrary,
      });
    }
  }

  render() {
    const { playlist, runtime, isLibrary } = this.state;

    if (!playlist) {
      return <Loader />;
    }

    const artworkURL = artworkForMediaItem(playlist, 220);
    const date = new Date(playlist.attributes.lastModifiedDate);

    return (
      <div className={classes.panel}>
        <div className={classes.aside}>
          <div className={classes.artworkWrapper}>
            <img src={artworkURL} />
          </div>
          <span className={classes.albumRuntimeDescription}>
            {playlist.attributes.trackCount}
            songs,
            {runtime}
          </span>
          {isLibrary ? (
            ''
          ) : (
            <>
              <div className={classes.playlistExtraInfo}>
                <h5>Last updated</h5>
                <span>{date.toLocaleDateString('en-US')}</span>
              </div>
              <div className={classes.playlistExtraInfo}>
                <h5>Description</h5>
                <span>{playlist.attributes.description.standard}</span>
              </div>
            </>
          )}
        </div>
        <div className={classes.main} ref={this.ref}>
          <span className={classes.title}>{playlist.attributes.name}</span>
          <span className={classes.subtitle}>{playlist.attributes.curatorName}</span>
          {playlist.relationships ? (
            <SongList
              scrollElement={this.ref}
              load={() => playlist.relationships.tracks.data}
              album={false}
              showArtist
              showAlbum
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    );
  }
}

PlaylistPanel.propTypes = {
  playlist: PropTypes.any,
  id: PropTypes.any,
};

PlaylistPanel.defaultProps = {
  playlist: null,
  id: null,
};
