import React from 'react';

import PropTypes from 'prop-types';
import classes from './PlaylistPanel.scss';
import { artworkForMediaItem, humanifyMillis } from '../../../utils/Utils';
import SongList from '../Songs/SongList/SongList';
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
        (totalDuration, track) =>
          totalDuration + track.attributes ? track.attributes.durationInMillis : 0,
        0
      );

      this.setState({
        playlist,
        runtime: humanifyMillis(albumLength),
      });
    }
  }

  render() {
    const { playlist, runtime } = this.state;

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
              <span className={classes.titleMeta}>{`${trackCount} songs, ${runtime}`}</span>
            </div>
          </div>
          {playlist.attributes.description && (
            <div className={classes.description}>
              <span
                dangerouslySetInnerHTML={{ __html: playlist.attributes.description.standard }} // eslint-disable-line react/no-danger
              />
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
