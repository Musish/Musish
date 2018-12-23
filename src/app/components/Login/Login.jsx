import React from 'react';

import PropTypes from 'prop-types';
import classes from './Login.scss';

export default function Login(props) {
  return (
    <div className={classes.loginContainer}>
      <a
        className="github-fork-ribbon"
        href="https://github.com/Musish/Musish"
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
        target={'_blank'}
      >
        Fork me on GitHub
      </a>
      <div className={classes.title}>
        <div className={classes.brand}>
          <span>Musi.sh</span>
        </div>
        <div className={classes.betaLabel}>
          <span>beta</span>
        </div>
      </div>
      <h5 className={classes.subheading}>
        {'Just like '}
        <i className="fab fa-apple" />
        {' Music... ish.'}
      </h5>
      <hr />
      <p className={classes.accountCaption}>
        Musi.sh uses your Apple Music library to provide you with an amazing listening experience.
        Please connect your account below.
      </p>
      <button type={'button'} onClick={props.onClick} className={classes.button}>
        Connect to Apple Music
      </button>
      <span className={classes.secureConnection}>
        <i className={'fas fa-lock'} />
        {' Secure authentication via Apple.com.'}
      </span>
      <div className={classes.disclaimer}>
        <div className={classes.disclaimerIcon}>
          <span>
            <i className="fas fa-info icon" />
          </span>
        </div>
        <div className={classes.disclaimerText}>
          {
            "Musi.sh is not affiliated with Apple, Inc. Our service does not access, collect, or store any personal or account information. 'Apple', 'Apple Music' and the Apple logo are trademarks of Apple, Inc."
          }
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  onClick: PropTypes.func.isRequired,
};
