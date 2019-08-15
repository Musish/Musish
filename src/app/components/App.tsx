import React, { useEffect } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Alert from 'react-s-alert';
import ConnectedMenu from './Common/ContextMenu/ContextMenu';
import LyricsModal from './Common/Player/Lyrics/LyricsModal';
import Layout from './Layout';
import AuthorizeProvider from './Providers/AuthorizeProvider';
import GoogleAnalyticsProvider from './Providers/GoogleAnalyticsProvider';
import LastfmProvider from './Providers/LastfmProvider';
import LyricsModalProvider from './Providers/LyricsModalProvider';
import ModalProvider, { ModalRenderer } from './Providers/ModalProvider';
import MusicKitProvider from './Providers/MusicKitProvider';
import PlaylistsProvider from './Providers/PlaylistsProvider';
import QueueModalProvider from './Providers/QueueProvider';
import SentryBoundary from './Providers/SentryBoundary';
import AlbumPage from './Routes/Album/AlbumPage';
import ArtistPage from './Routes/Catalog/Artist/ArtistPage';
import BrowsePage from './Routes/Catalog/Browse/BrowsePage';
import GenrePage from './Routes/Catalog/Browse/Genres/Genre/GenrePage';
import ForYouPage from './Routes/Catalog/ForYou/ForYouPage';
import RadioPage from './Routes/Catalog/Radio/RadioPage';
import AlbumsPage from './Routes/Library/Albums/AlbumsPage';
import ArtistsPage from './Routes/Library/Artists/ArtistsPage';
import PlaylistsPage from './Routes/Library/Playlists/PlaylistsPage';
import RecentlyAddedPage from './Routes/Library/RecentlyAdded/RecentlyAddedPage';
import SongsPage from './Routes/Library/Songs/SongsPage';
import PlaylistPage from './Routes/Playlist/PlaylistPage';
import SearchPage from './Routes/Search/SearchPage';

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      document.addEventListener('contextmenu', event => event.preventDefault());

      window.onbeforeunload = () => {
        return 'Are you sure you want to leave?';
      };
    }
  }, []);

  return (
    <SentryBoundary>
      <MusicKitProvider>
        <Router>
          <GoogleAnalyticsProvider>
            <AuthorizeProvider>
              <PlaylistsProvider>
                <ModalProvider>
                  <QueueModalProvider>
                    <LyricsModalProvider>
                      <LastfmProvider>
                        <Layout>
                          <Switch>
                            <Route path={'/'} exact component={ForYouPage} />
                            <Route path={'/me/added'} component={RecentlyAddedPage} />
                            <Route path={'/me/albums'} component={AlbumsPage} />
                            <Route path={'/me/playlists'} exact component={PlaylistsPage} />
                            <Route
                              path={'/playlist/:id'}
                              exact
                              component={(props: RouteComponentProps) => (
                                <PlaylistPage key={props.location.pathname} {...props} />
                              )}
                            />
                            <Route
                              path={'/me/playlist/:id'}
                              exact
                              component={(props: RouteComponentProps) => (
                                <PlaylistPage key={props.location.pathname} {...props} />
                              )}
                            />
                            <Route
                              path={'/album/:id'}
                              exact
                              component={(props: RouteComponentProps) => (
                                <AlbumPage key={props.location.pathname} {...props} />
                              )}
                            />
                            <Route
                              path={'/me/album/:id'}
                              exact
                              component={(props: RouteComponentProps) => (
                                <AlbumPage key={props.location.pathname} {...props} />
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
                              }: RouteComponentProps<{ source: string; query: string }>) => (
                                <SearchPage key={`${source}${query}`} />
                              )}
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
                  </QueueModalProvider>
                </ModalProvider>
              </PlaylistsProvider>
            </AuthorizeProvider>
          </GoogleAnalyticsProvider>
        </Router>
      </MusicKitProvider>
    </SentryBoundary>
  );
}

export default DragDropContext(HTML5Backend)(App);
