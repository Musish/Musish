import React from 'react';
import { Link, Route } from 'react-router-dom';
import classes from '../../Sidebar.scss';

export interface MenuItemProps {
  to: string;
  label: string;
  exact?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, label, exact = true }: MenuItemProps) => {
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
};

export default MenuItem;
