import React from 'react';
import { ContextMenuTrigger as OriginalContextMenuTrigger } from 'react-contextmenu';
import { MENU_TYPE } from './ContextMenu';

function collect(props: any, render: any) {
  return {
    ...props,
    render: render(),
  };
}

// From node_modules/react-contextmenu/src/index.d.ts
interface ContextMenuTriggerProps {
  attributes?: React.HTMLAttributes<any>;
  disable?: boolean;
  holdToDisplay?: number;
  renderTag?: React.ElementType;
}

interface ContextMenuTrigger extends ContextMenuTriggerProps {
  render: any;
}

const ContextMenuTrigger: React.FC<ContextMenuTrigger> = ({
  render,
  ...rest
}: ContextMenuTrigger) => {
  return (
    <OriginalContextMenuTrigger
      id={MENU_TYPE}
      collect={props => collect(props, render)}
      {...rest}
    />
  );
};

export default ContextMenuTrigger;
