import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import SongList from '../common/SongList/SongList';
import { API_URL, artworkForMediaItem, humanifyMillis } from '../common/Utils';
import classes from './PlaylistPage.scss';

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistId: this.props.match.params.id || this.props.playlist,
      runtime: '',
      playlist: null,
      songs: [],
      end: false,
    };

    this.scrollRef = React.createRef();

    this.load = this.load.bind(this);
    this.onSetItems = this.onSetItems.bind(this);
  }

  onSetItems({ items: songs, end }) {
    this.setState({
      songs,
      end,
    });

    const albumLength = songs.reduce(
      (totalDuration, song) => totalDuration + song.attributes.durationInMillis,
      0
    );

    this.setState({
      runtime: humanifyMillis(albumLength),
    });
  }

  async load(params, { page }) {
    const { playlistId } = this.state;
    const music = MusicKit.getInstance();

    if (page === 0) {
      const isLibrary = playlistId.startsWith('p.');
      const playlist = isLibrary
        ? await music.api.library.playlist(playlistId, { offset: params.offset })
        : await music.api.playlist(playlistId, { offset: params.offset });

      const { tracks } = playlist.relationships;

      this.setState({
        playlist,
        nextUrl: tracks.next,
      });

      return tracks.data;
    }

    if (!this.state.nextUrl) {
      return [];
    }

    const { data } = await axios.get(`${API_URL}${this.state.nextUrl}`, {
      headers: {
        Authorization: `Bearer ${music.developerToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Music-User-Token': music.musicUserToken,
      },
    });

    this.setState({
      nextUrl: data.next,
    });

    return data.data;
  }

  renderHeader() {
    const { playlist, runtime, songs, end } = this.state;

    if (!playlist) {
      return null;
    }

    const artworkURL = artworkForMediaItem(playlist, 80);

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
          load={this.load}
          scrollElement={this.scrollRef}
          showAlbum
          showArtist
          onSetItems={this.onSetItems}
        />
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
