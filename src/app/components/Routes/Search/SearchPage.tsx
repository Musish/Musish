import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import withMK from '../../../hoc/withMK';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';
import translate from '../../../utils/translations/Translations';
import AlbumItem from '../../Common/AlbumItem/AlbumItem';
import ArtistItem from '../../Common/ArtistItem/ArtistItem';
import Loader from '../../Common/Loader/Loader';
import PageContent from '../../Common/PageContent/PageContent';
import PageTitle from '../../Common/PageTitle/PageTitle';
import PlaylistItem from '../../Common/PlaylistItem/PlaylistItem';
import Tab from '../../Common/Tabs/Tab';
import Tabs from '../../Common/Tabs/Tabs';
import TracksGrid from '../../Common/Tracks/TracksGrid/TracksGrid';
import classes from './SearchPage.scss';

interface SearchPageProps extends MKProps, RouteComponentProps<{ query: string; source: string }> {}

interface SearchPageState {
  results: {
    albums: MusicKit.Resource | null;
    songs: MusicKit.MediaItem[] | null;
    playlists: MusicKit.Resource | null;
    artists: MusicKit.Resource | null;
  };
  loading: boolean | null;
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  public static playTrack({
    tracks,
    index,
  }: {
    track: MusicKit.MediaItem;
    tracks: MusicKit.MediaItem[];
    index: number;
  }) {
    MusicPlayerApi.playTrack(tracks, index);
  }
  public readonly ref = React.createRef<HTMLDivElement>();

  constructor(props: SearchPageProps) {
    super(props);

    this.state = {
      results: {
        albums: null,
        songs: null,
        playlists: null,
        artists: null,
      },
      loading: null,
    };

    this.ref = React.createRef();
  }

  public componentDidMount() {
    this.search();
  }

  public search = async () => {
    const query = this.props.match.params.query.replace(' ', '+');
    if (query.length === 0) {
      this.setState({
        results: {
          albums: null,
          songs: null,
          playlists: null,
          artists: null,
        },
      });
      return;
    }

    this.setState({
      loading: true,
    });

    switch (this.props.match.params.source) {
      case 'catalog':
        await this.searchCatalog(query);
        break;
      case 'library':
        await this.searchLibrary(query);
        break;
      default:
        break;
    }

    this.setState({
      loading: false,
    });
  };

  public searchCatalog = async (query: string) => {
    const res = (await this.props.mk.instance.api.search(query, {
      types: ['albums', 'songs', 'playlists', 'artists'],
      limit: 24,
    })) as any;
    const { results } = this.state;
    this.setState({
      results: {
        ...results,
        albums: res.albums ? res.albums.data : [],
        songs: res.songs ? res.songs.data : [],
        playlists: res.playlists ? res.playlists.data : [],
        artists: res.artists ? res.artists.data : [],
      },
    });
  };

  public searchLibrary = async (query: string) => {
    const res = await this.props.mk.instance.api.library.search(query, {
      types: ['library-albums', 'library-songs', 'library-playlists', 'library-artists'],
      limit: 24,
    });
    const { results } = this.state;
    this.setState({
      results: {
        ...results,
        albums: res['library-albums'] ? res['library-albums'].data : [],
        songs: res['library-songs'] ? res['library-songs'].data : [],
        playlists: res['library-playlists'] ? res['library-playlists'].data : [],
        artists: res['library-artists'] ? res['library-artists'].data : [],
      },
    });
  };

  public renderSongs = () => {
    const { songs } = this.state.results;

    if (!songs || songs.length === 0) {
      return null;
    }

    return (
      <>
        <h3>{translate.songs}</h3>
        <TracksGrid tracks={songs} showArtist showAlbum playTrack={SearchPage.playTrack} />
      </>
    );
  };

  public renderAlbums = () => {
    const { albums } = this.state.results;

    if (!albums || albums.length === 0) {
      return null;
    }

    return (
      <>
        <h3>{translate.albums}</h3>
        <div className={classes.searchGrid}>
          {albums.map((album: MusicKit.Resource) => (
            <AlbumItem key={album.id} album={album} size={120} />
          ))}
        </div>
      </>
    );
  };

  public renderPlaylists = () => {
    const { playlists } = this.state.results;

    if (!playlists || playlists.length === 0) {
      return null;
    }

    return (
      <>
        <h3>{translate.playlists}</h3>
        <div className={classes.searchGrid}>
          {playlists.map((playlist: MusicKit.Resource) => (
            <PlaylistItem key={playlist.id} playlist={playlist} size={120} />
          ))}
        </div>
      </>
    );
  };

  public renderArtists = () => {
    const { artists } = this.state.results;

    if (!artists || artists.length === 0) {
      return null;
    }

    return (
      <>
        <h3>{translate.artists}</h3>
        <div className={classes.searchArtistsGrid}>
          {artists.slice(0, 12).map((artist: MusicKit.Resource) => (
            <ArtistItem artist={artist} size={41} key={artist.id} />
          ))}
        </div>
      </>
    );
  };

  public renderResults = () => {
    const { loading } = this.state;

    const songs = this.renderSongs();
    const albums = this.renderAlbums();
    const playlists = this.renderPlaylists();
    const artists = this.renderArtists();

    const isEmpty = !(loading || songs || albums || playlists || artists);

    return (
      <>
        {loading && <Loader />}

        {isEmpty ? (
          <div className={classes.searchError}>
            <span className={classes.searchErrorTitle} role={'img'} aria-label={'loudly-crying'}>
              😭
            </span>
            <span className={classes.searchErrorDetails}>{translate.noResultsFound}</span>
          </div>
        ) : (
          <>
            {songs}
            {artists}
            {albums}
            {playlists}
          </>
        )}
      </>
    );
  };

  public render() {
    const { isAuthorized } = this.props.mk.instance;
    const { query } = this.props.match.params;
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle
          title={translate.formatString(translate.searchingFor, this.props.match.params.query)}
          context={translate.search}
        />

        <Tabs>
          <Tab name={translate.appleMusic} route={`/search/catalog/${query}`}>
            {this.renderResults()}
          </Tab>
          <Tab name={translate.myLibrary} route={`/search/library/${query}`}>
            {isAuthorized ? (
              this.renderResults()
            ) : (
              <div className={classes.searchError}>
                <span
                  className={classes.searchErrorTitle}
                  role={'img'}
                  aria-label={'loudly-crying'}
                >
                  😱
                </span>
                <span className={classes.searchErrorDetails}>
                  {translate.unauthorisedLibrarySearch}
                </span>
              </div>
            )}
          </Tab>
        </Tabs>
      </PageContent>
    );
  }
}

export default withMK(withRouter(SearchPage));
