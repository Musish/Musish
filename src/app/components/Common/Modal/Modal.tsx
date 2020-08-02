import React, { CSSProperties, ReactNode } from 'react';

import classes from './Modal.scss';

interface ModalProps {
  handleClose: () => void;
  style?: CSSProperties;
  width?: number;
  render: () => ReactNode;
}

function Modal(props: ModalProps) {
  const { style = {}, width } = props;
  const inlineStyles = {
    width,
    ...style,
  };

  return (
    <div className={classes.container} onClick={props.handleClose}>
      <div className={classes.modalWrapper}>
        <div className={classes.modal} onClick={e => e.stopPropagation()} style={inlineStyles}>
          {props.render()}
        </div>
      </div>
    </div>
  );
}

export default Modal;
