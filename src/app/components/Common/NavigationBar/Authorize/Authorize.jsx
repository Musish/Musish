import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './Authorize.scss';
import withMK from '../../../../hoc/withMK';
import { AuthorizeContext } from '../../../Providers/AuthorizeProvider';
import withContext from '../../../../hoc/withContext';
import translate from '../../../../utils/translations/Translations';

class Authorize extends Component {
  logout = async () => {
    await this.props.mk.instance.unauthorize();
  };

  login = async () => {
    await this.props.mk.instance.authorize();
    window.location.reload();
  };

  render() {
    const button = this.props.authorized ? (
      <span onClick={this.logout}>{translate.logout}</span>
    ) : (
      <span onClick={this.login}>{translate.login}</span>
    );

    return <div className={classes.authorizeWrapper}>{button}</div>;
  }
}

Authorize.propTypes = {
  mk: PropTypes.any.isRequired,
  authorized: PropTypes.bool.isRequired,
};

export default withMK(withContext(Authorize, AuthorizeContext));
