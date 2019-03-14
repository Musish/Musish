import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classes from './NavigationBar.scss';
import SearchBar from './Search/SearchBar';
import Authorize from './Authorize/Authorize';
import Settings from './Settings/Settings';
import AuthorizeContext from './Authorize/AuthorizeContext';
import withContext from '../../../hoc/withContext';

function NavigationBar(props) {
  return (
    <nav className={classes.navigationBar}>
      <h1 className={classes.brand}>
        <Link to={props.authorized ? '/' : '/browse'}>
          <span className={cx(classes.icon, 'musicon musicon-logo')} />
          <span className={classes.name}>Musish</span>
        </Link>
      </h1>
      <div style={{ flex: 1 }} />
      <SearchBar />
      <Settings />
      <Authorize />
    </nav>
  );
}

NavigationBar.propTypes = {
  authorized: PropTypes.bool.isRequired,
};

export default withContext(NavigationBar, AuthorizeContext);
