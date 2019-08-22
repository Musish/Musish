import React from 'react';
import withContext from '../../../../hoc/withContext';
import withMK from '../../../../hoc/withMK';
import translate from '../../../../utils/translations/Translations';
import { AuthorizeContext } from '../../../Providers/AuthorizeProvider';
import classes from './AuthorizationButton.scss';

interface AuthorizationButtonProps extends MKProps {
  authorized: boolean;
}

const AuthorizationButton: React.FC<AuthorizationButtonProps> = ({ mk, authorized }) => {
  async function logout() {
    await mk.instance.unauthorize();
  }

  async function login() {
    await mk.instance.authorize();
    window.location.reload();
  }

  const button = authorized ? (
    <span onClick={logout}>{translate.logout}</span>
  ) : (
    <span onClick={login}>{translate.login}</span>
  );

  return <div className={classes.authorizeWrapper}>{button}</div>;
};

export default withMK(withContext(AuthorizationButton, AuthorizeContext));
