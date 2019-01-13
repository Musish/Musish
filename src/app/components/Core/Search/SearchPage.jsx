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
      catalogData: null,
      libraryData: null,
      loading: null,
      songs: null,
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
        catalogData: null,
        libraryData: null,
      });
      this.updateSongs();
      return;
    }

    this.setState({
      loading: true,
    });

    await Promise.all([this.searchCatalog(query), this.searchLibrary(query)]);
    this.updateSongs();

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

  updateSongs() {
    this.setState({
      songs: this.getItems('songs')
        .filter(song => song.type === this.getKey('songs'))
        .slice(0, 10),
    });
  }

  async searchCatalog(query) {
    const catalogData = await this.props.mk.instance.api.search(query, {
      types: ['albums', 'songs', 'playlists', 'artists'],
      limit: 24,
    });
    this.setState({
      catalogData,
    });
  }

  async searchLibrary(query) {
    const libraryData = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists'],
      limit: 24,
    });
    this.setState({
      libraryData,
    });
  }

  getItems(type) {
    let items = [];

    const { catalogData, libraryData } = this.state;

    if (libraryData && libraryData[`library-${type}`]) {
      items = [...items, ...libraryData[`library-${type}`].data];
    }

    if (catalogData && catalogData[type]) {
      items = [...items, ...catalogData[type].data];
    }

    return items;
  }

  renderResults(type, source, rowRenderer) {
    const items = this.getItems(type).filter(item => item.type === source);

    if (!items || items.length === 0) {
      return `No result for ${type} matching "${this.props.match.params.query}" in your ${
        this.props.match.params.source
      }.`;
    }
    return (
      <>
        {items.map(rowRenderer)}
        {this.state.loading && <Loader />}
      </>
    );
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
        <SongList
          scrollElement={this.ref}
          tracks={this.state.songs}
          showArtist
          showAlbum
          playSong={SearchPage.playSong}
        />

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
