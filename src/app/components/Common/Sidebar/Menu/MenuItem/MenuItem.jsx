import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import classes from '../../Sidebar.scss';

export default function MenuItem(props) {
  const { to, label, exact } = props;

  return (
    <li>
      <Route path={to} exact={exact}>
        {({ match }) => (
          <Link to={to} className={match ? classes.active : ''}>
            {label}
          </Link>
        )}
      </Route>
    </li>
  );
}

MenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

MenuItem.defaultProps = {
  exact: true,
};
