import React from 'react';
import { connectMenu, ContextMenu } from 'react-contextmenu';
import PropTypes from 'prop-types';

export const MENU_TYPE = 'DYNAMIC';

function DynamicMenu({ trigger }) {
  const renderer = trigger ? trigger.render : <></>;

  return <ContextMenu id={MENU_TYPE}>{renderer}</ContextMenu>;
}

DynamicMenu.propTypes = {
  trigger: PropTypes.any,
};

DynamicMenu.defaultProps = {
  trigger: null,
};

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

export default ConnectedMenu;
