import React from 'react';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Albums from './Core/Albums/Albums';
import Layout from './Core/Layout/Layout';
import Artists from './Core/Artists/Artists';
import Artist from './Core/Artists/Artist';
import Playlist from './Core/Playlists/Playlist';
import Songs from './Core/Songs/Songs';
import Playlists from './Core/Playlists/Playlists';
import Album from './Core/Albums/Album';

export default class App extends React.Component {
  render() {
    return (
        <MusicKitProvider>
          <MusicKitAuthorizeProvider>
            <Router>
              <Layout>
                <Switch>
                  <Route path="/" exact component={Artists}/>
                  <Route path="/albums" exact component={Albums}/>
                  <Route path="/albums/:id" exact component={Album}/>
                  <Route path="/playlists" exact component={Playlists}/>
                  <Route path="/playlists/:id" exact component={props => <Playlist key={props.location.pathname} {...props} />} />
                  <Route path="/artists" exact component={Artists}/>
                  <Route path="/artists/:id" exact component={Artist}/>
                  <Route path="/songs" exact component={Songs}/>
                  <Redirect to="/"/>
                </Switch>
              </Layout>
            </Router>
          </MusicKitAuthorizeProvider>
        </MusicKitProvider>
    );
  }
}
