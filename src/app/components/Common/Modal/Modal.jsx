import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Modal.scss';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open,
    };
  }

  render() {
    if (!this.state.open) {
      return null;
    }

    const { style, width } = this.props;
    const inlineStyles = {
      width,
      ...style,
    };

    return (
      <div className={classes.container} onClick={this.props.handleClose}>
        <div className={classes.modal} onClick={e => e.stopPropagation()} style={inlineStyles}>
          {this.props.render()}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  style: PropTypes.object,
  width: PropTypes.number,
  render: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

Modal.defaultProps = {
  open: false,
  style: {},
  width: null,
};

export default Modal;
