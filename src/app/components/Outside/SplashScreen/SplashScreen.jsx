import React from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';

import classes from './SplashScreen.scss';

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);

    this.loginNavigate = this.loginNavigate.bind(this);
    this.browseNavigate = this.browseNavigate.bind(this);
  }

  loginNavigate() {
    this.props.onClick();
    this.props.history.push('/');
  }

  browseNavigate() {
    this.props.onBrowse();
    this.props.history.push('/browse');
  }

  render() {
    return (
      <div className={classes.splashContainer}>
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
            <span>Musish</span>
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
          Musish uses your Apple Music library to provide you with an amazing listening experience.
          Please connect your account below.
        </p>
        <button type={'button'} onClick={this.loginNavigate} className={classes.button}>
          Connect to Apple Music
        </button>
        <span className={classes.secureConnection}>
          <i className={'fas fa-lock'} />
          {' Secure authentication via Apple.com.'}
        </span>
        <button
          type={'button'}
          onClick={this.browseNavigate}
          className={cx(classes.button, classes.browseButton)}
        >
          Or just browse
        </button>
        <div className={classes.disclaimer}>
          <div className={classes.disclaimerIcon}>
            <span>
              <i className="fas fa-info icon" />
            </span>
          </div>
          <div className={classes.disclaimerText}>
            {
              "Musish is not affiliated with Apple, Inc. Our service does not access, collect, or store any personal or account information. 'Apple', 'Apple Music' and the Apple logo are trademarks of Apple, Inc."
            }
          </div>
        </div>
      </div>
    );
  }
}

SplashScreen.propTypes = {
  onClick: PropTypes.func.isRequired,
  onBrowse: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
};

export default withRouter(SplashScreen);
