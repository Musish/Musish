import cx from 'classnames';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import translate from '../../../utils/translations/Translations';
import classes from './SplashScreen.scss';

interface SplashScreenProps extends RouteComponentProps {
  onClick: () => void;
  onBrowse: () => void;
}

class SplashScreen extends React.Component<SplashScreenProps> {
  public loginNavigate = () => {
    this.props.onClick();
    this.props.history.push('/');
  };

  public browseNavigate = () => {
    this.props.onBrowse();
    this.props.history.push('/browse');
  };

  public render() {
    return (
      <div className={classes.splashContainer}>
        <a
          className='github-fork-ribbon'
          href='https://github.com/Musish/Musish'
          data-ribbon='Fork me on GitHub'
          title='Fork me on GitHub'
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
          <i className='fab fa-apple' />
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
              <i className='fas fa-info icon' />
            </span>
          </div>
          <div className={classes.disclaimerText}>{translate.legalNotice}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(SplashScreen);
