import React from 'react';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
        <MusicKitProvider>
          <MusicKitAuthorizeProvider>
            <Router>
              <Switch>
                <Route path="/" exact component={() => "Home"}/>
                <Route path="/test1" exact component={() => "Test 1"}/>
                <Route path="/test2" exact component={() => "Test 2"}/>
                <Redirect to="/"/>
              </Switch>
            </Router>
          </MusicKitAuthorizeProvider>
        </MusicKitProvider>
    )
  }
}
