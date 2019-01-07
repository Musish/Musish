import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './Logout.scss';
import withMK from '../../../../../hoc/withMK';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  async logout() {
    await this.props.mk.instance.unauthorize();
  }

  async login() {
    await this.props.mk.instance.authorize();
  }

  render() {
    const button = this.props.mk.instance.isAuthorized ? (
      <span onClick={this.logout}>Logout</span>
    ) : (
      <span onClick={this.login}>Login</span>
    );

    return <div className={classes.logoutWrapper}>{button}</div>;
  }
}

Logout.propTypes = {
  mk: PropTypes.any.isRequired,
};

const bindings = {
  [MusicKit.Events.authorizationStatusDidChange]: 'authorization',
};

export default withMK(Logout, bindings);
