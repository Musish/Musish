import React from 'react';
import PropTypes from 'prop-types';
import classes from './SearchPage.scss';
import withMK from '../../../hoc/withMK';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import Loader from '../../common/Loader';
import SongResultItem from '../Layout/NavigationBar/Search/SongResultItem';
import AlbumItem from '../Albums/AlbumItem';
import PlaylistItem from '../Playlists/PlaylistItem';
import SongList from '../Songs/SongList/SongList';
import SongsPage from '../Songs/SongsPage';
import ArtistResultItem from '../Layout/NavigationBar/Search/ArtistResultItem';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      catalogData: null,
      libraryData: null,
    };

    this.ref = React.createRef();

    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.search();
  }

  async search() {
    const query = this.props.query.replace(' ', '+');

    if (query.length === 0) {
      this.setState({
        catalogData: null,
        libraryData: null,
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

  async searchCatalog(query) {
    const catalogData = await this.props.mk.instance.api.search(query, {
      types: ['albums', 'songs', 'playlists', 'artists'],
      limit: 10,
    });

    this.setState({
      catalogData,
    });
  }

  async searchLibrary(query) {
    const libraryData = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists'],
      limit: 10,
    });

    this.setState({
      libraryData,
    });
  }

  getItems(type) {
    let songs = [];

    const { catalogData, libraryData } = this.state;

    if (libraryData && libraryData[`library-${type}`]) {
      songs = [...songs, ...libraryData[`library-${type}`].data];
    }

    if (catalogData && catalogData[type]) {
      songs = [...songs, ...catalogData[type].data];
    }

    return songs;
  }

  renderResults(type, rowRenderer) {
    const songs = this.getItems(type);

    if (!songs || songs.length === 0) {
      return null;
    }
    return (
      <>
        {songs.map(rowRenderer)}
        {this.state.loading && <Loader />}
      </>
    );
  }

  render() {
    console.log(this.getItems('songs'));
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Your Results'} context={'Search'} />

        <h3>Top Results</h3>
        <h3>Songs</h3>
        <SongList
          load={() => this.getItems('songs')}
          scrollElement={this.ref}
          showAlbum
          showArtist
          playSong={SongsPage.playSong}
        />

        <h3>Playlists</h3>
        <div className={classes.searchGrid}>
          {this.renderResults('playlists', playlist => (
            <PlaylistItem key={playlist.id} playlist={playlist} size={170} navigate />
          ))}
        </div>

        <h3>Albums</h3>
        <div className={classes.searchGrid}>
          {this.renderResults('albums', album => (
            <AlbumItem key={album.id} album={album} size={170} navigate />
          ))}
        </div>

        <h3>Artists</h3>
        <div className={classes.searchGrid}>
          {/*{this.renderResults('artists', artist => (*/}
            {/*<AlbumItem key={artist.id} playlist={artist} size={170} navigate />*/}
          {/*))}*/}
        </div>

        <h3>People</h3>
      </PageContent>
    );
  }
}

SearchPage.propTypes = {
  mk: PropTypes.any.isRequired,
  query: PropTypes.string.isRequired,
};

export default withMK(SearchPage);
