import React from 'react';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Albums from './Albums';
import Layout from './Layout';
import Artists from './Artists';
import Artist from './Artist';
import Playlist from './Playlist';
import Songs from './Songs';
import Playlists from './Playlists';
import Album from './Album';

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
