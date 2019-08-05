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
interface IContextMenuTriggerProps {
  attributes?: React.HTMLAttributes<any>;
  disable?: boolean;
  holdToDisplay?: number;
  renderTag?: React.ElementType;
}

interface IContextMenuTrigger extends IContextMenuTriggerProps {
  render: any;
}

const ContextMenuTrigger: React.FC<IContextMenuTrigger> = ({
  render,
  ...rest
}: IContextMenuTrigger) => {
  return (
    <OriginalContextMenuTrigger
      id={MENU_TYPE}
      collect={props => collect(props, render)}
      {...rest}
    />
  );
};

export default ContextMenuTrigger;
