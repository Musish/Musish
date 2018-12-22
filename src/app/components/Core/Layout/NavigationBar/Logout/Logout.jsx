import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './Logout.scss';
import withMK from '../../../../../hoc/withMK';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.mk.instance.unauthorize();
    window.location.reload();
  }

  render() {
    return (
      <div className={classes.logoutWrapper}>
        <span onClick={this.logout}>Logout</span>
      </div>
    );
  }
}

Logout.propTypes = {
  mk: PropTypes.any.isRequired,
};

export default withMK(Logout);
