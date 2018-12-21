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
    const playlistId = this.props.id || this.props.playlist.id;

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

    const artworkURL = artworkForMediaItem(playlist, 80);
    const trackCount =
      playlist.attributes.trackCount ||
      (playlist.relationships && playlist.relationships.tracks.data.length);

    return (
      <div className={classes.panel}>
        <div className={classes.header}>
          <div className={classes.headerMain}>
            <div className={classes.artworkWrapper}>
              <img src={artworkURL} alt={playlist.attributes.name} />
            </div>
            <div className={classes.titleWrapper}>
              <span className={classes.name}>{playlist.attributes.name}</span>
              <span className={classes.curator}>
                {`Playlist by ${playlist.attributes.curatorName}`}
              </span>
              <span className={classes.titleMeta}>
                {`${trackCount} songs, ${runtime}`}
              </span>
            </div>
          </div>
          {playlist.attributes.description.standard && (
            <div className={classes.description}>
              <span>{playlist.attributes.description.standard}</span>
            </div>
          )}
        </div>
        <div className={classes.main} ref={this.ref}>
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
