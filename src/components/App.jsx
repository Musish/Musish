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
import AlbumItem from './AlbumItem';
import Layout from './Layout';
import Artists from './Artists';
import Artist from './Artist';
import SongList from './SongList';
import PlaylistItem from './PlaylistItem';

export default class App extends React.Component {
  render() {
    return (
        <MusicKitProvider>
          <MusicKitAuthorizeProvider>
            <Router>
              <Layout>
                <Switch>
                  <Route path="/" exact component={() => 'Home'}/>
                  <Route path="/albums" exact component={Albums}/>
                  <Route path="/playlists" exact component={PlaylistItem}/>
                  <Route path="/artists" exact component={Artists}/>
                  <Route path="/artist/{id}" exact component={Artist}/>
                  <Route path="/songs" exact component={SongList}/>
                  <Redirect to="/"/>
                </Switch>
              </Layout>
            </Router>
          </MusicKitAuthorizeProvider>
        </MusicKitProvider>
    );
  }
}
