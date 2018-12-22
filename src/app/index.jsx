import '@babel/polyfill';
import 'whatwg-fetch';
import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/components/App';
import './common.scss';

ReactDOM.render(<App />, document.getElementById('app-root'));

if (module.hot) {
  module.hot.accept();
}
