import React from 'react';
import PropTypes from 'prop-types';

import classes from './Modal.scss';

function Modal(props) {
  const { style, width } = props;
  const inlineStyles = {
    width,
    ...style,
  };

  return (
    <div className={classes.container} onClick={props.handleClose}>
      <div className={classes.modal} onClick={e => e.stopPropagation()} style={inlineStyles}>
        {props.render()}
      </div>
    </div>
  );
}

Modal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  style: PropTypes.object,
  width: PropTypes.number,
  render: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  style: {},
  width: null,
};

export default Modal;
