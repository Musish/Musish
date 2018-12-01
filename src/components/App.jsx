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

export default class App extends React.Component {
  render() {
    return (
        <MusicKitProvider>
          <MusicKitAuthorizeProvider>
            <Layout>
              <Router>
                <Switch>
                  <Route path="/" exact component={() => 'Home'}/>
                  <Route path="/albums" exact component={Albums}/>
                  <Route path="/albumItem" exact component={AlbumItem}/>
                  <Redirect to="/"/>
                </Switch>
              </Router>
            </Layout>
          </MusicKitAuthorizeProvider>
        </MusicKitProvider>
    );
  }
}
