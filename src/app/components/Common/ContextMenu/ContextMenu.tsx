import React from 'react';
import { connectMenu, ContextMenu } from 'react-contextmenu';

export const MENU_TYPE = 'DYNAMIC';

interface DynamicMenuProps {
  trigger?: any;
}

const DynamicMenu: React.FC<DynamicMenuProps> = ({ trigger = null }: DynamicMenuProps) => {
  const renderer = trigger ? trigger.render : <></>;

  return <ContextMenu id={MENU_TYPE}>{renderer}</ContextMenu>;
};

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

export default ConnectedMenu;
