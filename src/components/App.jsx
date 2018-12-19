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
import OverviewPage from './Core/Overview/OverviewPage';
import BrowsePage from "./Core/Browse/BrowsePage";
import RadioPage from "./Core/Radio/RadioPage";

export default class App extends React.Component {
  render() {
    return (
        <MusicKitProvider>
          <MusicKitAuthorizeProvider>
            <Router>
              <Layout>
                <Switch>
                  <Route path="/" exact component={OverviewPage}/>
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
            </Router>
          </MusicKitAuthorizeProvider>
        </MusicKitProvider>
    );
  }
}
