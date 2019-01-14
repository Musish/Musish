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

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResults: false,
      query: '',
      catalogData: null,
      libraryData: null,
    };

    this.handleShowResults = this.handleShowResults.bind(this);
    this.handleHideResults = this.handleHideResults.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.search = debounce(this.search, 400, { maxWait: 1000 }).bind(this);
  }

  handleShowResults() {
    this.setState({
      showResults: true,
    });
  }

  handleHideResults() {
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

  renderResults(label, type, rowRenderer) {
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

  render() {
    const { query, showResults } = this.state;
    const { location } = this.props;
    const slugs = location.pathname.split('/');
    // Providing you're on the search route, it fetches the second segment
    // of the url which is either the 'catalog' or the 'library'
    const searchSource = slugs.length >= 2 && slugs[1] === 'search' ? slugs[2] : 'catalog';

    return (
      <div className={cx(classes.navSearch, { [classes.active]: showResults })}>
        <div className={classes.navSearchWrapper}>
          <form
            onSubmit={e => {
              e.preventDefault();
              this.props.history.push(`/search/${searchSource}/${query}`);
              return false;
            }}
          >
            <input
              type="text"
              placeholder="Search music"
              value={query}
              onChange={this.handleSearch}
              onFocus={this.handleShowResults}
              onBlur={this.handleHideResults}
            />
          </form>

          <div className={classes.results}>
            <div className={classes.resultsContainer}>
              {this.renderResults('Songs', 'songs', song => (
                <SongResultItem song={song} key={song.id} />
              ))}
              {this.renderResults('Albums', 'albums', album => (
                <AlbumResultItem album={album} size={30} key={album.id} />
              ))}
              {this.renderResults('Artists', 'artists', artist => (
                <ArtistResultItem artist={artist} key={artist.id} />
              ))}
              {this.renderResults('Playlists', 'playlists', playlist => (
                <PlaylistResultItem playlist={playlist} size={30} key={playlist.id} />
              ))}
            </div>
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
