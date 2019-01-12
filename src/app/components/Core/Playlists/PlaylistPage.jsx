import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import SongList from '../Songs/SongList/SongList';
import { artworkForMediaItem, humanifyMillis } from '../../../utils/Utils';
import classes from './PlaylistPage.scss';
import * as MusicApi from '../../../services/MusicApi';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistId: this.props.match.params.id,
      runtime: '',
      playlist: null,
      songs: [],
      end: false,
    };

    this.scrollRef = React.createRef();
    this.store = {};

    this.onSetItems = this.onSetItems.bind(this);
    this.playSong = this.playSong.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.shufflePlaylist = this.shufflePlaylist.bind(this);
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

  onSetItems({ items: songs, end }) {
    this.setState({
      songs,
      end,
    });

    const playlistLength = songs.reduce(
      (totalDuration, song) => totalDuration + song.attributes.durationInMillis,
      0
    );

    this.setState({
      runtime: humanifyMillis(playlistLength),
    });
  }

  playSong({ index }) {
    MusicPlayerApi.playPlaylist(this.state.playlist, index);
  }

  async playPlaylist(index = 0) {
    MusicPlayerApi.playPlaylist(this.state.playlist, index);
  }

  async shufflePlaylist() {
    MusicPlayerApi.shufflePlaylist(this.state.playlist);
  }

  renderHeader() {
    const { playlist, runtime, songs, end } = this.state;

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
              {playlist.attributes.curatorName ? (
                `Playlist by ${playlist.attributes.curatorName}`
              ) : (
                <>In your personal library</>
              )}
            </span>
            <span className={classes.titleMeta}>
              {`${songs.length}${end ? '' : '+'} songs, ${runtime}`}
            </span>
            <div className={classes.playActions}>
              <button type={'button'} onClick={this.playPlaylist} className={classes.button}>
                <i className={`${classes.icon} fas fa-play`} />
                Play
              </button>
              <button type={'button'} onClick={this.shufflePlaylist} className={classes.button}>
                <i className={`${classes.icon} fas fa-random`} />
                Shuffle
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
        <PageTitle context={'My Library'} />
        {this.renderHeader()}
        <SongList
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
          playSong={this.playSong}
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
