import React from 'react';
import classes from '../Sidebar.scss';
import MenuItem, { IMenuItemProps } from './MenuItem/MenuItem';

interface ISidebarMenuProps {
  title: string;
  items: IMenuItemProps[];
}

const SidebarMenu: React.FC<ISidebarMenuProps> = props => {
  const { title, items } = props;

  return (
    <div className={classes.menu}>
      <h3>{title}</h3>
      <ul>
        {items.map(item => (
          <MenuItem {...item} key={item.to} />
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
