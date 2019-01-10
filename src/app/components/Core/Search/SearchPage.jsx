import React from 'react';
import PropTypes from 'prop-types';
import classes from './SearchPage.scss';
import withMK from '../../../hoc/withMK';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import Loader from '../../common/Loader';
import SongResultItem from '../Layout/NavigationBar/Search/SongResultItem';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      query: '',
      catalogData: null,
      libraryData: null,
    };

    this.search = this.search.bind(this);
  }

  async search() {
    this.setState({
      query: this.props.query,
    });

    const query = this.state.query.replace(' ', '+');

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
      limit: 5,
    });

    this.setState({
      catalogData,
    });
  }

  async searchLibrary(query) {
    const libraryData = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists'],
      limit: 5,
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
      <div className={classes.results}>
        {songs.map(rowRenderer)}

        {this.state.loading && <Loader />}
      </div>
    );
  }

  render() {
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Your Results'} context={'Search'} />

        <div className={classes.container}>
          <h3>Top Results</h3>
          <h3>Songs</h3>
          {this.renderResults('songs', song => (
            <SongResultItem song={song} key={song.id} />
          ))}
          <h3>Playlists</h3>
          <h3>Albums</h3>
          <h3>Artists</h3>
          <h3>People</h3>
        </div>
      </PageContent>
    );
  }
}

SearchPage.propTypes = {
  mk: PropTypes.any.isRequired,
  query: PropTypes.string.isRequired,
};

export default withMK(SearchPage);
