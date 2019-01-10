import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Alert from 'react-s-alert';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import AlbumsPage from './Core/Albums/AlbumsPage';
import Layout from './Core/Layout/Layout';
import ArtistPage from './Core/Artists/ArtistPage';
import ArtistsPage from './Core/Artists/ArtistsPage';
import Playlist from './Core/Playlists/PlaylistPage';
import SongsPage from './Core/Songs/SongsPage';
import PlaylistsPage from './Core/Playlists/PlaylistsPage';
import ForYouPage from './Core/ForYou/ForYouPage';
import BrowsePage from './Core/Browse/BrowsePage';
import RadioPage from './Core/Radio/RadioPage';
import QueueContext from './Core/Player/Queue/QueueContext';
import ModalContext from './common/Modal/ModalContext';
import Modal from './common/Modal/Modal';
import ConnectedMenu from './common/ContextMenu/ContextMenu';
import LyricsModalContext from './Core/Player/Lyrics/LyricsModalContext';
import LyricsModal from './Core/Player/Lyrics/LyricsModal';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showQueue: false,
      modalsContents: [],
      lyricsModalOpen: false,
    };
  }

  render() {
    const queueState = {
      show: this.state.showQueue,
      doShow: () => this.setState({ showQueue: true }),
      doHide: () => this.setState({ showQueue: false }),
    };

    const modalState = {
      push: c =>
        this.setState(state => ({
          modalsContents: [...state.modalsContents, c],
        })),
      pop: () =>
        this.setState(state => ({
          modalsContents: [...state.modalsContents.slice(0, -1)],
        })),
    };

    const lyricsModalState = {
      opened: this.state.lyricsModalOpen,
      open: () => this.setState({ lyricsModalOpen: true }),
      close: () => this.setState({ lyricsModalOpen: false }),
    };

    return (
      <MusicKitProvider>
        <Router>
          <MusicKitAuthorizeProvider>
            <QueueContext.Provider value={queueState}>
              <ModalContext.Provider value={modalState}>
                <LyricsModalContext.Provider value={lyricsModalState}>
                  <Layout>
                    <Switch>
                      <Route path="/" exact component={ForYouPage} />
                      <Route path="/albums" component={AlbumsPage} />
                      <Route path="/playlists" exact component={PlaylistsPage} />
                      <Route
                        path="/playlists/:id"
                        exact
                        component={props => <Playlist key={props.location.pathname} {...props} />}
                      />
                      <Route path="/artists" exact component={ArtistsPage} />
                      <Route path="/artists/:id" exact component={ArtistsPage} />
                      <Route path="/artist/:id" exact component={ArtistPage} />
                      <Route path="/songs" exact component={SongsPage} />
                      <Route path="/browse" exact component={BrowsePage} />
                      <Route path="/radio" exact component={RadioPage} />
                      <Redirect to="/" />
                    </Switch>
                    {this.state.modalsContents.length > 0 && (
                      <Modal
                        open
                        handleClose={modalState.pop}
                        render={() => this.state.modalsContents.slice(-1)[0]}
                      />
                    )}
                  </Layout>
                  <ConnectedMenu />
                  <Alert stack offset={60} />
                  <LyricsModal />
                </LyricsModalContext.Provider>
              </ModalContext.Provider>
            </QueueContext.Provider>
          </MusicKitAuthorizeProvider>
        </Router>
      </MusicKitProvider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
