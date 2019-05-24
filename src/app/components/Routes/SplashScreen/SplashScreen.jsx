import React from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';

import classes from './SplashScreen.scss';
import translate from '../../../utils/translations/Translations';

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
            <h1>Musish</h1>
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
        <p className={classes.accountCaption}>{translate.musishDescription}</p>
        <button type={'button'} onClick={this.loginNavigate} className={classes.button}>
          {translate.connect}
        </button>
        <span className={classes.secureConnection}>
          {translate.formatString(translate.securityMessage, <i className={'fas fa-lock'} />)}
        </span>
        <button
          type={'button'}
          onClick={this.browseNavigate}
          className={cx(classes.button, classes.browseButton)}
        >
          {translate.justBrowse}
        </button>
        <div className={classes.disclaimer}>
          <div className={classes.disclaimerIcon}>
            <span>
              <i className="fas fa-info icon" />
            </span>
          </div>
          <div className={classes.disclaimerText}>{translate.legalNotice}</div>
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
