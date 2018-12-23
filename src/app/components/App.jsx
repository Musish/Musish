import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import AlbumsPage from './Core/Albums/AlbumsPage';
import Layout from './Core/Layout/Layout';
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
import SearchPage from './Core/Search/SearchPage';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showQueue: false,
      modalsContents: [],
    };

    this.contextSetState = this.contextSetState.bind(this);
  }

  contextSetState(k, v) {
    this.setState({
      [k]: v,
    });
  }

  render() {
    const queueState = {
      show: this.state.showQueue,
      doShow: () => this.contextSetState('showQueue', true),
      doHide: () => this.contextSetState('showQueue', false),
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

    return (
      <MusicKitProvider>
        <MusicKitAuthorizeProvider>
          <Router>
            <QueueContext.Provider value={queueState}>
              <ModalContext.Provider value={modalState}>
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
                    <Route path="/songs" exact component={SongsPage} />
                    <Route path="/browse" exact component={BrowsePage} />
                    <Route path="/radio" exact component={RadioPage} />
                    <Route path="/search/:query" exact component={SearchPage} />
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
              </ModalContext.Provider>
            </QueueContext.Provider>
          </Router>
        </MusicKitAuthorizeProvider>
      </MusicKitProvider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
