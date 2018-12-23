import React from 'react';
import { connectMenu, ContextMenu } from 'react-contextmenu';
import PropTypes from 'prop-types';

export const MENU_TYPE = 'DYNAMIC';

function DynamicMenu({ trigger }) {
  return <ContextMenu id={MENU_TYPE}>{trigger && trigger.render}</ContextMenu>;
}

DynamicMenu.propTypes = {
  trigger: PropTypes.any,
};

DynamicMenu.defaultProps = {
  trigger: null,
};

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

export default ConnectedMenu;
