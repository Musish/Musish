import React, { Component } from 'react';
import classes from './Logout.scss';
import withMK from '../../../../../hoc/withMK';
import PropTypes from 'prop-types';
class Logout extends Component {

  logout() {
    this.props.mk.instance.unauthorize();
    window.location.reload();
  }

  render() {
    return (
      <div className={classes.logoutWrapper}>
        <span onClick={() => this.logout()}>Logout</span>
      </div>
    );
  }
}

Logout.propTypes = {
  mk: PropTypes.any.isRequired,
};

export default withMK(Logout);
