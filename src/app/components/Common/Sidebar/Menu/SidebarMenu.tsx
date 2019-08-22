import React from 'react';
import classes from '../Sidebar.scss';
import MenuItem, { MenuItemProps } from './MenuItem/MenuItem';

interface SidebarMenuProps {
  title: string;
  items: MenuItemProps[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = props => {
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
