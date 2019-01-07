import React from 'react';
import { ContextMenuTrigger as OriginalContextMenuTrigger } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { MENU_TYPE } from './ContextMenu';

function collect(props, render) {
  return {
    ...props,
    render: render(),
  };
}

export default function ContextMenuTrigger({ render, ...rest }) {
  return (
    <OriginalContextMenuTrigger
      id={MENU_TYPE}
      collect={props => collect(props, render)}
      {...rest}
    />
  );
}

ContextMenuTrigger.propTypes = {
  render: PropTypes.func.isRequired,
};
