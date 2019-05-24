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
import QueueContext from './Common/Player/Queue/QueueContext';
import ModalContext from './Common/Modal/ModalContext';
import Modal from './Common/Modal/Modal';
import ConnectedMenu from './Common/ContextMenu/ContextMenu';
import LyricsModalContext from './Common/Player/Lyrics/LyricsModalContext';
import LyricsModal from './Common/Player/Lyrics/LyricsModal';
import SearchPage from './Routes/Search/SearchPage';
import GoogleAnalyticsProvider from './Providers/GoogleAnalyticsProvider';
import PlaylistsContext from './Common/Sidebar/Menu/MenuItem/PlaylistsContext';
import SentryBoundary from './Providers/SentryBoundary';
import LastfmProvider from './Providers/LastfmProvider';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showQueue: false,
      modalsContents: [],
      lyricsModalOpen: false,
      playlists: [],
    };

    this.popModal = this.popModal.bind(this);
  }

  componentDidMount() {
    Mousetrap.bind('esc', this.popModal, 'keyup');

    if (process.env.NODE_ENV !== 'development') {
      document.addEventListener('contextmenu', event => event.preventDefault());
    }
  }

  popModal() {
    this.setState(state => ({
      modalsContents: state.modalsContents.slice(1),
    }));
  }

  renderModal(modalState) {
    const modal = this.state.modalsContents[0];

    return (
      <Modal
        key={this.state.modalsContents.length}
        open
        handleClose={modalState.pop}
        render={() => modal.content}
        style={modal.style}
      />
    );
  }

  render() {
    const queueState = {
      show: this.state.showQueue,
      doShow: () => this.setState({ showQueue: true }),
      doHide: () => this.setState({ showQueue: false }),
    };

    const modalState = {
      push: (content, style = {}) =>
        this.setState(state => ({
          modalsContents: [{ content, style }, ...state.modalsContents],
        })),
      replace: (content, style = {}) =>
        this.setState(state => ({
          modalsContents: [...state.modalsContents.slice(0, -1), { content, style }],
        })),
      pop: this.popModal,
      flush: () =>
        this.setState({
          modalsContents: [],
        }),
    };

    const lyricsModalState = {
      opened: this.state.lyricsModalOpen,
      open: () => this.setState({ lyricsModalOpen: true }),
      close: () => this.setState({ lyricsModalOpen: false }),
    };

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
                  <QueueContext.Provider value={queueState}>
                    <ModalContext.Provider value={modalState}>
                      <LyricsModalContext.Provider value={lyricsModalState}>
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
                            {this.state.modalsContents.length > 0 && this.renderModal(modalState)}
                          </Layout>
                          <ConnectedMenu />
                          <Alert stack offset={60} />
                          <LyricsModal />
                        </LastfmProvider>
                      </LyricsModalContext.Provider>
                    </ModalContext.Provider>
                  </QueueContext.Provider>
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
