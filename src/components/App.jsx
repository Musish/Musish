import React from 'react';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import AlbumsPage from './Core/Albums/AlbumsPage';
import Layout from './Core/Layout/Layout';
import ArtistsPage from './Core/Artists/ArtistsPage';
import Playlist from './Core/Playlists/PlaylistPage';
import SongsPage from './Core/Songs/SongsPage';
import PlaylistsPage from './Core/Playlists/PlaylistsPage';
import ForYouPage from './Core/ForYou/ForYouPage';
import BrowsePage from "./Core/Browse/BrowsePage";
import RadioPage from "./Core/Radio/RadioPage";
import QueueContext from "./Core/Player/Queue/QueueContext";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };

    this.contextSetState = this.contextSetState.bind(this);
  }

  contextSetState(k, v) {
    this.setState({
      [k]: v,
    })
  }

  render() {
    const queueState = {
      show: this.state.show,
      doShow: () => this.contextSetState('show', true),
      doHide: () => this.contextSetState('show', false)
    };

    return (
        <MusicKitProvider>
          <MusicKitAuthorizeProvider>
            <Router>
              <QueueContext.Provider value={queueState}>
                <Layout>
                  <Switch>
                    <Route path="/" exact component={ForYouPage}/>
                    <Route path="/albums" component={AlbumsPage}/>
                    <Route path="/playlists" exact component={PlaylistsPage}/>
                    <Route path="/playlists/:id" exact component={props => <Playlist key={props.location.pathname} {...props} />} />
                    <Route path="/artists" exact component={ArtistsPage}/>
                    <Route path="/artists/:id" exact component={ArtistsPage}/>
                    <Route path="/songs" exact component={SongsPage}/>
                    <Route path="/browse" exact component={BrowsePage}/>
                    <Route path="/radio" exact component={RadioPage}/>
                    <Redirect to="/"/>
                  </Switch>
                </Layout>
              </QueueContext.Provider>
            </Router>
          </MusicKitAuthorizeProvider>
        </MusicKitProvider>
    );
  }
}
