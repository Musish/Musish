import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import withContext from '../../../hoc/withContext';
import { AuthorizeContext } from '../../Providers/AuthorizeProvider';
import AuthorizationButton from './AuthorizationButton/AuthorizationButton';
import classes from './NavigationBar.scss';
import SearchBar from './Search/SearchBar';
import Settings from './Settings/Settings';

interface NavigationBarProps {
  authorized: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = props => {
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
      <AuthorizationButton />
    </nav>
  );
};

export default withContext(NavigationBar, AuthorizeContext);
