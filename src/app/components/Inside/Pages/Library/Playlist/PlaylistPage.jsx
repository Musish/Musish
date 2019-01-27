import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageContent from '../../../../Common/PageContent/PageContent';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import TracksList from '../../../../Common/Tracks/TracksList/TracksList';
import { artworkForMediaItem, humanifyMillis } from '../../../../../utils/Utils';
import classes from './PlaylistPage.scss';
import * as MusicApi from '../../../../../services/MusicApi';
import * as MusicPlayerApi from '../../../../../services/MusicPlayerApi';
import translate from '../../../../../utils/translations/Translations';

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistId: this.props.match.params.id,
      runtime: '',
      playlist: null,
      tracks: [],
      end: false,
    };

    this.scrollRef = React.createRef();
    this.store = {};

    this.onSetItems = this.onSetItems.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.shufflePlayPlaylist = this.shufflePlayPlaylist.bind(this);
    this.playlistLoader = this.playlistLoader.bind(this);
  }

  componentDidMount() {
    this.fetchPlaylist();
  }

  async fetchPlaylist() {
    const playlist = await this.playlistLoader(this.getPlaylistId());

    this.setState({
      playlist,
    });
  }

  playlistLoader(...args) {
    const music = MusicKit.getInstance();
    if (this.getPlaylistId().startsWith('p.')) {
      return music.api.library.playlist(...args);
    }

    return music.api.playlist(...args);
  }

  getPlaylistId() {
    return this.state.playlistId;
  }

  onSetItems({ items: tracks, end }) {
    this.setState({
      tracks,
      end,
    });

    const playlistLength = tracks.reduce(
      (totalDuration, track) =>
        totalDuration + (track.attributes ? track.attributes.durationInMillis : 0),
      0
    );

    this.setState({
      runtime: humanifyMillis(playlistLength),
    });
  }

  playTrack({ index }) {
    MusicPlayerApi.playPlaylist(this.state.playlist, index);
  }

  async playPlaylist(index = 0) {
    MusicPlayerApi.playPlaylist(this.state.playlist, index);
  }

  async shufflePlayPlaylist() {
    MusicPlayerApi.shufflePlayPlaylist(this.state.playlist);
  }

  renderHeader() {
    const { playlist, runtime, tracks, end } = this.state;

    if (!playlist) {
      return null;
    }

    const artworkURL = artworkForMediaItem(playlist, 100);

    return (
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
              {`${tracks.length}${end ? '' : '+'} ${translate.songs}, ${runtime}`}
            </span>
            <div className={classes.playActions}>
              <button type={'button'} onClick={this.playPlaylist} className={classes.button}>
                <i className={`${classes.icon} fas fa-play`} />
                {translate.play}
              </button>
              <button type={'button'} onClick={this.shufflePlayPlaylist} className={classes.button}>
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
    );
  }

  render() {
    return (
      <PageContent innerRef={this.scrollRef}>
        <PageTitle context={`${translate.myLibrary}`} />
        {this.renderHeader()}
        <TracksList
          load={MusicApi.infiniteLoadRelationships(
            this.getPlaylistId(),
            this.playlistLoader,
            'tracks',
            this.store
          )}
          scrollElement={this.scrollRef}
          showAlbum
          showArtist
          onSetItems={this.onSetItems}
          playTrack={this.playTrack}
        />
      </PageContent>
    );
  }
}

PlaylistPage.propTypes = {
  id: PropTypes.any,
  match: PropTypes.object,
};

PlaylistPage.defaultProps = {
  id: null,
  match: null,
};

export default withRouter(PlaylistPage);
