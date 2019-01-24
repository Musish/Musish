import React from 'react';
import PropTypes from 'prop-types';
import SplashScreen from './Outside/SplashScreen/SplashScreen';
import TokenLoader from './Outside/LoginLoader/LoginLoader';
import withMK from '../hoc/withMK';
import AuthorizeContext from './Inside/NavigationBar/Authorize/AuthorizeContext';

class MusicKitAuthorizeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      browsing: false,
      isAuthorized: props.mk.instance.isAuthorized,
    };

    this.check = this.check.bind(this);
    this.handleTokenCheck = this.handleTokenCheck.bind(this);
  }

  check({ authorizationStatus }) {
    if (authorizationStatus === 0) {
      this.setState({
        isAuthorized: false,
      });
    } else {
      setImmediate(() => {
        this.setState({
          isAuthorized: true,
        });
      });
    }
  }

  async handleTokenCheck() {
    const music = this.props.mk.instance;
    if (!this.state.isAuthorized) {
      this.setState({
        ready: true,
      });
      return;
    }

    try {
      await music.api.library.songs({ limit: 0 });
    } catch (e) {
      await music.unauthorize();
    }

    setImmediate(() => {
      this.setState({
        ready: true,
      });
    });
  }

  componentDidMount() {
    this.handleTokenCheck();

    MusicKit.getInstance().addEventListener(
      MusicKit.Events.authorizationStatusDidChange,
      this.check
    );
  }

  render() {
    const { ready, isAuthorized, browsing } = this.state;

    if (!ready) {
      return <TokenLoader />;
    }

    if (!isAuthorized && !browsing) {
      return (
        <SplashScreen
          onClick={() => this.props.mk.instance.authorize()}
          onBrowse={() => this.setState({ browsing: true })}
        />
      );
    }

    return (
      <AuthorizeContext.Provider value={{ authorized: isAuthorized }}>
        {this.props.children}
      </AuthorizeContext.Provider>
    );
  }
}

MusicKitAuthorizeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  mk: PropTypes.any.isRequired,
};

export default withMK(MusicKitAuthorizeProvider);
