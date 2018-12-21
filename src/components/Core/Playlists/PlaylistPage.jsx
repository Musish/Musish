import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from '../../common/Loader';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import SongList from '../common/SongList/SongList';
import { artworkForMediaItem, humanifyMillis } from '../common/Utils';
import classes from './PlaylistPage.scss';

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistId: this.props.match.params.id || this.props.playlist,
    };
    console.log('constructorr');

    this.load = this.load.bind(this);
    this.scrollRef = React.createRef();
  }

  async load(params, { page }) {
    const { playlistId } = this.state;
    const music = MusicKit.getInstance();

    const isLibrary = playlistId.startsWith('p.');
    const playlist = isLibrary
      ? await music.api.library.playlist(playlistId, { offset: page * 100 })
      : await music.api.playlist(playlistId, { offset: page * 100 });

    if (page === 0) {
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

    return playlist.relationships.tracks.data;
  }

  renderHeader() {
    const { playlist, runtime, isLibrary } = this.state;

    if (!playlist) {
      return;
    }

    const artworkURL = artworkForMediaItem(playlist, 80);
    // const date = new Date(playlist.attributes.lastModifiedDate).toLocaleDateString('en-US'); // TODO: Where to put?
    const trackCount = playlist.attributes.trackCount || playlist.relationships.tracks.data.length;

    return (
      <div className={classes.header}>
        <div className={classes.headerMain}>
          <div className={classes.artworkWrapper}>
            <img src={artworkURL} alt={playlist.attributes.name} />
          </div>
          <div className={classes.titleWrapper}>
            <span className={classes.name}>{playlist.attributes.name}</span>
            <span className={classes.curator}>
              {playlist.attributes.curatorName ? (
                <>
                  Playlist by
                  {playlist.attributes.curatorName}
                </>
              ) : (
                <>In your personal library</>
              )}
            </span>
            <span className={classes.titleMeta}>
              {trackCount}
              songs,
              {runtime}
            </span>
          </div>
        </div>
        {playlist.attributes.description && (
          <div className={classes.description}>
            <span>{playlist.attributes.description.standard}</span>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { playlist, runtime, isLibrary } = this.state;
    console.log(this.state);

    // const artworkURL = artworkForMediaItem(playlist, 80);
    // const date = new Date(playlist.attributes.lastModifiedDate).toLocaleDateString('en-US'); // TODO: Where to put?
    // /const trackCount = playlist.attributes.trackCount || playlist.relationships.tracks.data.length;

    return (
      <PageContent innerRef={this.scrollRef}>
        <PageTitle context={'My Library'} />
        {this.renderHeader()}
        <SongList load={this.load} scrollElement={this.scrollRef} showAlbum showArtist />
      </PageContent>
    );
  }
}

PlaylistPage.propTypes = {
  playlist: PropTypes.any,
  id: PropTypes.any,
  match: PropTypes.object,
};

PlaylistPage.defaultProps = {
  playlist: null,
  id: null,
  match: null,
};

export default withRouter(PlaylistPage);
