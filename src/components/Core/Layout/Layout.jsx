import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import NavigationBar from './NavigationBar/NavigationBar';
import Sidebar from './Sidebar/Sidebar';
import Queue from '../Player/Queue/Queue';

export default function Layout(props) {
  return (
    <Fragment>
      <NavigationBar />

      <div id="main-wrapper">
        <Queue />
        <Sidebar />
        <main id="main-content" className={props.className}>
          {props.children}
        </main>
      </div>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
};

Layout.defaultProps = {
  className: '',
};
