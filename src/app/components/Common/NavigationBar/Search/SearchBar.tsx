import cx from 'classnames';
import debounce from 'lodash/debounce';
import React, { ChangeEvent, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import withMK from '../../../../hoc/withMK';
import translate from '../../../../utils/translations/Translations';
import { hasAttributes } from '../../../../utils/Utils';
import Loader from '../../Loader/Loader';
import AlbumResultItem from './AlbumResultItem';
import ArtistResultItem from './ArtistResultItem';
import PlaylistResultItem from './PlaylistResultItem';
import classes from './SearchBar.scss';
import SongResultItem from './SongResultItem';

type SearchBarProps = RouteComponentProps & MKProps;

interface SearchBarState {
  showResults: boolean;
  query: string;
  catalogData: any;
  libraryData: any;
  loading: boolean;
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  private readonly ref = React.createRef<HTMLDivElement>();

  constructor(props: SearchBarProps) {
    super(props);

    this.state = {
      showResults: false,
      query: '',
      catalogData: null,
      libraryData: null,
      loading: false,
    };

    this.search = debounce(this.search, 400, { maxWait: 1000 }).bind(this);
  }

  public componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  public handleShowResults = () => {
    this.setState({
      showResults: true,
    });
  };

  public handleClick = (event: MouseEvent) => {
    // Is inside search bar
    if (this.ref.current!.contains(event.target as HTMLElement)) {
      return;
    }

    // Is context menu
    if ((event.target as HTMLElement).closest('.react-contextmenu')) {
      return;
    }

    this.setState({
      showResults: false,
    });
  };

  public handleSearch = async ({ target: { value: query } }: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query,
    });

    const searchQuery = query.replace(' ', '+');

    await this.search(searchQuery);
  };

  public search = async (query: string) => {
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
    if (this.props.mk.instance.isAuthorized) {
      await Promise.all([this.searchCatalog(query), this.searchLibrary(query)]);
    } else {
      await this.searchCatalog(query);
    }

    this.setState({
      loading: false,
    });
  };

  public searchCatalog = async (query: string) => {
    const catalogData = await this.props.mk.instance.api.search(query, {
      types: ['albums', 'songs', 'playlists', 'artists'],
      limit: 3,
    });

    this.setState({
      catalogData,
    });
  };

  public searchLibrary = async (query: string) => {
    const libraryData = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists'],
      limit: 3,
    });

    this.setState({
      libraryData,
    });
  };

  public getItems = (type: string) => {
    const { catalogData, libraryData } = this.state;

    const libraryItems =
      libraryData && libraryData[`library-${type}`] ? libraryData[`library-${type}`].data : [];

    const catalogItems = catalogData && catalogData[type] ? catalogData[type].data : [];

    return [...libraryItems, ...catalogItems].filter(hasAttributes);
  };

  public renderType = (
    label: string,
    type: string,
    rowRenderer: (song: MusicKit.MediaItem, i: number) => ReactNode,
  ) => {
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
  };

  public renderResults = () => {
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
  };

  public render() {
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
              type='text'
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

export default withMK(withRouter(SearchBar));
