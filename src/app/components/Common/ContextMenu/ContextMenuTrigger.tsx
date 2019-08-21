import React from 'react';
import { ContextMenuTrigger as OriginalContextMenuTrigger } from 'react-contextmenu';
import { MENU_TYPE } from './ContextMenu';

function collect(props: any, render: any) {
  return {
    ...props,
    render: render(),
  };
}

type ContextMenuTriggerProps = Omit<
  React.ComponentProps<typeof OriginalContextMenuTrigger>,
  'id' | 'collect'
>;

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
