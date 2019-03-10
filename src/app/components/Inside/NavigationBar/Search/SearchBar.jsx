import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import classes from './SearchBar.scss';
import withMK from '../../../../hoc/withMK';
import withContext from '../../../../hoc/withContext';
import Loader from '../../../Common/Loader/Loader';
import SongResultItem from './SongResultItem';
import AlbumResultItem from './AlbumResultItem';
import ArtistResultItem from './ArtistResultItem';
import PlaylistResultItem from './PlaylistResultItem';
import AuthorizeContext from '../Authorize/AuthorizeContext';
import translate from '../../../../utils/translations/Translations';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false,
      query: '',
      catalogData: null,
      libraryData: null,
    };

    this.renderType = this.renderType.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.handleShowResults = this.handleShowResults.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.search = debounce(this.search, 400, { maxWait: 1000 }).bind(this);

    this.ref = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleShowResults() {
    this.setState({
      showResults: true,
    });
  }

  handleClick(event) {
    if (this.ref.current.contains(event.target)) {
      return;
    }

    if (event.target.closest('.react-contextmenu')) {
      return;
    }

    this.setState({
      showResults: false,
    });
  }

  async handleSearch({ target: { value: query } }) {
    this.setState({
      query,
    });

    const searchQuery = query.replace(' ', '+');

    await this.search(searchQuery);
  }

  async search(query) {
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
    if (this.props.authorized) {
      await Promise.all([this.searchCatalog(query), this.searchLibrary(query)]);
    } else {
      await this.searchCatalog(query);
    }

    this.setState({
      loading: false,
    });
  }

  async searchCatalog(query) {
    const catalogData = await this.props.mk.instance.api.search(query, {
      types: ['albums', 'songs', 'playlists', 'artists'],
      limit: 3,
    });

    this.setState({
      catalogData,
    });
  }

  async searchLibrary(query) {
    const libraryData = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists'],
      limit: 3,
    });

    this.setState({
      libraryData,
    });
  }

  getItems(type) {
    const { catalogData, libraryData } = this.state;

    const libraryItems =
      libraryData && libraryData[`library-${type}`] ? libraryData[`library-${type}`].data : [];

    const catalogItems = catalogData && catalogData[type] ? catalogData[type].data : [];

    return [...libraryItems, ...catalogItems];
  }

  renderType(label, type, rowRenderer) {
    const songs = this.getItems(type);

    if (!songs || songs.length === 0) {
      return null;
    }

    return (
      <div className={classes.section}>
        <div className={classes.title}>{label}</div>

        {songs.map(rowRenderer)}

        {this.state.loading && <Loader />}
      </div>
    );
  }

  renderResults() {
    const songs = this.renderType(translate.songs, 'songs', song => (
      <SongResultItem song={song} key={song.id} />
    ));
    const albums = this.renderType(translate.albums, 'albums', album => (
      <AlbumResultItem album={album} size={30} key={album.id} />
    ));
    const artists = this.renderType(translate.artists, 'artists', artist => (
      <ArtistResultItem artist={artist} key={artist.id} />
    ));
    const playlists = this.renderType(translate.playlists, 'playlists', playlist => (
      <PlaylistResultItem playlist={playlist} size={30} key={playlist.id} />
    ));

    if (!(songs || albums || artists || playlists)) {
      return (
        <div className={classes.empty}>
          <i className={'fas fa-search'} />
          Enter a phrase to search Apple Music.
        </div>
      );
    }

    return (
      <>
        {songs}
        {albums}
        {artists}
        {playlists}
      </>
    );
  }

  render() {
    const { query, showResults } = this.state;
    const { location } = this.props;
    const slugs = location.pathname.split('/');
    // Providing you're on the search route, it fetches the second segment
    // of the url which is either the 'catalog' or the 'library'
    const searchSource = slugs.length >= 2 && slugs[1] === 'search' ? slugs[2] : 'catalog';

    return (
      <div className={cx(classes.navSearch, { [classes.active]: showResults })}>
        <div ref={this.ref} className={classes.navSearchWrapper}>
          <form
            onSubmit={e => {
              e.preventDefault();
              this.props.history.push(`/search/${searchSource}/${query}`);
              return false;
            }}
          >
            <input
              type="text"
              placeholder={`${translate.searchMusic}`}
              value={query}
              onChange={this.handleSearch}
              onFocus={this.handleShowResults}
            />
            <button type={'submit'}>
              <i className={'fas fa-search'} />
            </button>
          </form>

          <div className={cx(classes.results, { [classes.show]: showResults })}>
            <div className={classes.resultsContainer}>{this.renderResults()}</div>
          </div>
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  mk: PropTypes.any.isRequired,
  authorized: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(withMK(withContext(SearchBar, AuthorizeContext)));
