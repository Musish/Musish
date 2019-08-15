import '@babel/polyfill';
import * as Sentry from '@sentry/browser';
import 'normalize.css/normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import './assets/styles/common.scss';
import App from './components/App';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}

ReactDOM.render(<App />, document.getElementById('app-root'));

if (module.hot) {
  module.hot.accept();
}
