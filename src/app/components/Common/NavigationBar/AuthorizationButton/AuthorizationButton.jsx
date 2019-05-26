import React from 'react';
import PropTypes from 'prop-types';
import classes from './AuthorizationButton.scss';
import withMK from '../../../../hoc/withMK';
import { AuthorizeContext } from '../../../Providers/AuthorizeProvider';
import withContext from '../../../../hoc/withContext';
import translate from '../../../../utils/translations/Translations';

function AuthorizationButton(props) {
  async function logout() {
    await props.mk.instance.unauthorize();
  }

  async function login() {
    await props.mk.instance.authorize();
    window.location.reload();
  }

  const button = props.authorized ? (
    <span onClick={logout}>{translate.logout}</span>
  ) : (
    <span onClick={login}>{translate.login}</span>
  );

  return <div className={classes.authorizeWrapper}>{button}</div>;
}

AuthorizationButton.propTypes = {
  mk: PropTypes.any.isRequired,
  authorized: PropTypes.bool.isRequired,
};

export default withMK(withContext(AuthorizationButton, AuthorizeContext));
