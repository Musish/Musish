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
import Artist from './Core/Artists/ArtistPage';
import Playlist from './Core/Playlists/Playlist';
import SongsPage from './Core/Songs/SongsPage';
import PlaylistsPage from './Core/Playlists/PlaylistsPage';
import Album from './Core/Albums/AlbumPage';

export default class App extends React.Component {
  render() {
    return (
        <MusicKitProvider>
          <MusicKitAuthorizeProvider>
            <Router>
              <Layout>
                <Switch>
                  <Route path="/" exact component={ArtistsPage}/>
                  <Route path="/albums" exact component={AlbumsPage}/>
                  <Route path="/albums/:id" exact component={Album}/>
                  <Route path="/playlists" exact component={PlaylistsPage}/>
                  <Route path="/playlists/:id" exact component={props => <Playlist key={props.location.pathname} {...props} />} />
                  <Route path="/artists" exact component={ArtistsPage}/>
                  <Route path="/artists/:id" exact component={Artist}/>
                  <Route path="/songs" exact component={SongsPage}/>
                  <Redirect to="/"/>
                </Switch>
              </Layout>
            </Router>
          </MusicKitAuthorizeProvider>
        </MusicKitProvider>
    );
  }
}
