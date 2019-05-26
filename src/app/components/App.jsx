import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Alert from 'react-s-alert';
import Mousetrap from 'mousetrap';
import MusicKitProvider from './Providers/MusicKitProvider';
import AuthorizeProvider from './Providers/AuthorizeProvider';
import AlbumsPage from './Routes/Library/Albums/AlbumsPage';
import Layout from './Layout';
import ArtistPage from './Routes/Catalog/Artist/ArtistPage';
import ArtistsPage from './Routes/Library/Artists/ArtistsPage';
import Playlist from './Routes/Library/Playlist/PlaylistPage';
import SongsPage from './Routes/Library/Songs/SongsPage';
import PlaylistsPage from './Routes/Library/Playlists/PlaylistsPage';
import RecentlyAddedPage from './Routes/Library/RecentlyAdded/RecentlyAddedPage';
import ForYouPage from './Routes/Catalog/ForYou/ForYouPage';
import BrowsePage from './Routes/Catalog/Browse/BrowsePage';
import GenrePage from './Routes/Catalog/Browse/Genres/Genre/GenrePage';
import RadioPage from './Routes/Catalog/Radio/RadioPage';
import ConnectedMenu from './Common/ContextMenu/ContextMenu';
import LyricsModal from './Common/Player/Lyrics/LyricsModal';
import SearchPage from './Routes/Search/SearchPage';
import GoogleAnalyticsProvider from './Providers/GoogleAnalyticsProvider';
import PlaylistsContext from './Common/Sidebar/Menu/MenuItem/PlaylistsContext';
import SentryBoundary from './Providers/SentryBoundary';
import LastfmProvider from './Providers/LastfmProvider';
import ModalProvider, { ModalRenderer } from './Providers/ModalProvider';
import LyricsModalProvider from './Providers/LyricsModalProvider';
import QueueModalProvider from './Providers/QueueProvider';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showQueue: false,
      playlists: [],
    };
  }

  componentDidMount() {
    Mousetrap.bind('esc', this.popModal, 'keyup');

    if (process.env.NODE_ENV !== 'development') {
      document.addEventListener('contextmenu', event => event.preventDefault());
    }
  }

  render() {
    const playlistsState = {
      playlists: this.state.playlists,
      setItems: items => {
        this.setState({
          playlists: items,
        });
      },
    };

    return (
      <SentryBoundary>
        <MusicKitProvider>
          <Router>
            <GoogleAnalyticsProvider>
              <AuthorizeProvider>
                <PlaylistsContext.Provider value={playlistsState}>
                  <QueueModalProvider>
                    <ModalProvider>
                      <LyricsModalProvider>
                        <LastfmProvider>
                          <Layout>
                            <Switch>
                              <Route path={'/'} exact component={ForYouPage} />
                              <Route path={'/me/added'} component={RecentlyAddedPage} />
                              <Route path={'/me/albums'} component={AlbumsPage} />
                              <Route path={'/me/playlists'} exact component={PlaylistsPage} />
                              <Route
                                path={'/me/playlists/:id'}
                                exact
                                component={props => (
                                  <Playlist key={props.location.pathname} {...props} />
                                )}
                              />
                              <Route path={'/me/artists'} exact component={ArtistsPage} />
                              <Route path={'/me/artists/:id'} component={ArtistsPage} />
                              <Route path={'/me/songs'} exact component={SongsPage} />
                              <Route path={'/artist/:id'} exact component={ArtistPage} />
                              <Route path={'/browse/genre/:id'} exact component={GenrePage} />
                              <Route path={'/browse'} component={BrowsePage} />
                              <Route path={'/radio'} exact component={RadioPage} />
                              <Route
                                path={'/search/:source/:query'}
                                exact
                                component={({
                                  match: {
                                    params: { source, query },
                                  },
                                }) => <SearchPage key={`${source}${query}`} />}
                              />
                              <Redirect to={'/'} />
                            </Switch>

                            <ModalRenderer />
                          </Layout>
                          <ConnectedMenu />
                          <Alert stack offset={60} />
                          <LyricsModal />
                        </LastfmProvider>
                      </LyricsModalProvider>
                    </ModalProvider>
                  </QueueModalProvider>
                </PlaylistsContext.Provider>
              </AuthorizeProvider>
            </GoogleAnalyticsProvider>
          </Router>
        </MusicKitProvider>
      </SentryBoundary>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
