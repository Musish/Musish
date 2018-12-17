import React, {Component} from 'react';
import PropTypes from 'prop-types';

import classes from "./Modal.scss";

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

    return (
      <div className={classes.container} onClick={this.props.handleClose}>
        <div className={classes.modal} onClick={e => e.stopPropagation()}>
          {this.props.render()}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  open: false,
};

export default Modal;
