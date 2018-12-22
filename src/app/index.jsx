import '@babel/polyfill';
import 'whatwg-fetch';
import '../../node_modules/normalize.css/normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './common.scss';

ReactDOM.render(<App />, document.getElementById('app-root'));

if (module.hot) {
  module.hot.accept();
}
