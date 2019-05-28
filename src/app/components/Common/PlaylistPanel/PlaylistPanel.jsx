import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { artworkForMediaItem, humanifyMillis, humanifyTrackNumbers } from '../../../utils/Utils';
import TracksList from '../Tracks/TracksList/TracksList';
import Loader from '../Loader/Loader';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';
import * as MusicApi from '../../../services/MusicApi';
import translate from '../../../utils/translations/Translations';
import withPseudoRoute from '../../../hoc/withPseudoRoute';
import classes from './PlaylistPanel.scss';

class PlaylistPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: null,
      runtime: 0,
      tracks: [],
    };

    this.playlistId = this.props.id || this.props.playlist.id;

    this.ref = React.createRef();
    this.store = {};
  }

  componentDidMount() {
    this.fetchPlaylist();
  }

  fetchPlaylist = async () => {
    const playlist = await this.playlistLoader(this.playlistId);

    this.setState({
      playlist,
    });
  };

  playlistLoader = (...args) => {
    const music = MusicKit.getInstance();
    if (this.playlistId.startsWith('p.')) {
      return music.api.library.playlist(...args);
    }

    return music.api.playlist(...args);
  };

  onSetItems = ({ items: tracks }) => {
    const playlistLength = tracks.reduce(
      (totalDuration, track) =>
        totalDuration + (track.attributes ? track.attributes.durationInMillis : 0),
      0,
    );

    this.setState({
      runtime: humanifyMillis(playlistLength),
      tracks,
    });
  };

  playTrack = ({ index }) => {
    MusicPlayerApi.playPlaylist(this.state.playlist, index);
  };

  playPlaylist = async (index = 0) => {
    MusicPlayerApi.playPlaylist(this.state.playlist, index);
  };

  shufflePlayPlaylist = async () => {
    MusicPlayerApi.shufflePlayPlaylist(this.state.playlist);
  };

  render() {
    const { playlist, runtime, tracks } = this.state;

    if (!playlist) {
      return <Loader />;
    }

    const artworkURL = artworkForMediaItem(playlist, 100);
    const trackCount = playlist.attributes.trackCount || tracks.length;

    return (
      <div className={cx(classes.panel, this.props.className)} ref={this.ref}>
        <div className={classes.header}>
          <div className={classes.headerMain}>
            <div className={classes.artworkWrapper}>
              <img src={artworkURL} alt={playlist.attributes.name} />
            </div>
            <div className={classes.titleWrapper}>
              <span className={classes.name}>{playlist.attributes.name}</span>
              <span className={classes.curator}>
                {playlist.attributes.curatorName
                  ? translate.formatString(translate.playlistBy, playlist.attributes.curatorName)
                  : translate.inYourPersonalLibrary}
              </span>
              <span className={classes.titleMeta}>
                {`${humanifyTrackNumbers(trackCount)}, ${runtime}`}
              </span>
              <div className={classes.playActions}>
                <button type={'button'} onClick={this.playPlaylist} className={classes.button}>
                  <i className={`${classes.icon} fas fa-play`} />
                  {translate.play}
                </button>
                <button
                  type={'button'}
                  onClick={this.shufflePlayPlaylist}
                  className={classes.button}
                >
                  <i className={`${classes.icon} fas fa-random`} />
                  {translate.shuffle}
                </button>
              </div>
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
        <div className={classes.main}>
          <TracksList
            scrollElement={this.ref}
            scrollElementModifier={e => e && e.parentElement}
            load={MusicApi.infiniteLoadRelationships(
              this.playlistId,
              this.playlistLoader,
              'tracks',
              this.store,
            )}
            album={false}
            showArtist
            showAlbum
            playTrack={this.playTrack}
            onSetItems={this.onSetItems}
          />
        </div>
      </div>
    );
  }
}

PlaylistPanel.propTypes = {
  playlist: PropTypes.any,
  id: PropTypes.any,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

PlaylistPanel.defaultProps = {
  playlist: null,
  id: null,
  className: null,
};

const pseudoRoute = ({ id, playlist }) => {
  const playlistId = id || playlist.id;
  let route = `/playlist/${playlistId}`;
  if (id.startsWith('p.')) {
    route = '/me' + route;
  }
  return route;
};

export default withPseudoRoute(PlaylistPanel, pseudoRoute);
