/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classes from './SearchPage.scss';
import withMK from '../../../hoc/withMK';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import Loader from '../../common/Loader';
import AlbumItem from '../Albums/AlbumItem';
import PlaylistItem from '../Playlists/PlaylistItem';
import SongList from '../Songs/SongList/SongList';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';
import ArtistItem from '../Artists/ArtistItem';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: {
        'albums': null,
        'songs': null,
        'playlists': null,
        'artists': null,
        'library-albums': null,
        'library-songs': null,
        'library-playlists': null,
        'library-artists': null,
      },
      loading: null,
    };

    this.ref = React.createRef();
    this.search = this.search.bind(this);
    this.handleCatalogChange = this.handleCatalogChange.bind(this);
    this.handleLibraryChange = this.handleLibraryChange.bind(this);
  }

  componentDidMount() {
    this.search();
  }

  async search() {
    const query = this.props.match.params.query.replace(' ', '+');
    if (query.length === 0) {
      this.setState({
        results: null,
      });
      return;
    }

    this.setState({
      loading: true,
    });

    await Promise.all([this.searchCatalog(query), this.searchLibrary(query)]);

    this.setState({
      loading: false,
    });
  }

  getKey(k) {
    if (this.props.match.params.source === 'library') {
      return `library-${k}`;
    }

    return k;
  }

  async searchCatalog(query) {
    const res = await this.props.mk.instance.api.search(query, {
      types: ['albums', 'songs', 'playlists', 'artists'],
      limit: 24,
    });
    const { results } = this.state;
    this.setState({
      results: {
        ...results,
        albums: res.albums ? res.albums.data : [],
        songs: res.songs ? res.songs.data : [],
        playlists: res.playlists ? res.playlists.data : [],
        artists: res.artists ? res.artists.data : []
      },
    });
  }

  async searchLibrary(query) {
    const res = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists'],
      limit: 24,
    });
    const { results } = this.state;
    this.setState({
      results: {
        ...results,
        'library-albums': res['library-albums'] ? res['library-albums'].data : [],
        'library-songs': res['library-songs'] ? res['library-songs'].data : [],
        'library-playlists': res['library-playlists'] ? res['library-playlists'].data : [],
        'library-artists': res['library-artists'] ? res['library-artists'].data : []
      }
    });
  }

  getItems(type) {
    return this.state.results[type];
  }

  renderResults(type, key, rowRenderer) {
    const items = this.getItems(key);

    if (!items) {
      return <Loader />;
    }

    if (items.length === 0) {
      return `No result for ${type} matching '${this.props.match.params.query}' in your ${
        this.props.match.params.source
      }.`;
    }

    return items.filter(item => item.type === key).map(rowRenderer);
  }

  static playSong({ songs, index }) {
    MusicPlayerApi.playSong(songs, index);
  }

  handleCatalogChange() {
    this.props.history.push(`/search/catalog/${this.props.match.params.query}`);
  }

  handleLibraryChange() {
    this.props.history.push(`/search/library/${this.props.match.params.query}`);
  }

  render() {
    return (
      <PageContent innerRef={this.ref}>
        <div className={classes.choices}>
          <div className={classes.selectionItem} onClick={this.handleCatalogChange}>
            Catalog
          </div>
          <div className={classes.selectionItem} onClick={this.handleLibraryChange}>
            Library
          </div>
        </div>
        <PageTitle title={`Search: '${this.props.match.params.query}'`} context={'Search'} />

        <h3>Songs</h3>
        {!this.state.loading && (
          <SongList
            scrollElement={this.ref}
            load={() => this.state.results[this.getKey('songs')].slice(0, 10)}
            showArtist
            showAlbum
            playSong={SearchPage.playSong}
          />
        )}

        <h3>Albums</h3>
        <div className={classes.searchGrid}>
          {this.renderResults('albums', this.getKey('albums'), album => (
            <AlbumItem key={album.id} album={album} size={170} navigate />
          ))}
        </div>

        <h3>Playlists</h3>
        <div className={classes.searchGrid}>
          {this.renderResults('playlists', this.getKey('playlists'), playlist => (
            <PlaylistItem key={playlist.id} playlist={playlist} size={170} navigate />
          ))}
        </div>

        <h3>Artists</h3>
        <div className={classes.searchArtistsGrid}>
          {this.renderResults('artists', this.getKey('artists'), artist => (
            <ArtistItem artist={artist} size={41} key={artist.id} />
          ))}
        </div>
      </PageContent>
    );
  }
}

SearchPage.propTypes = {
  mk: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  match: PropTypes.any.isRequired,
};

export default withMK(withRouter(SearchPage));