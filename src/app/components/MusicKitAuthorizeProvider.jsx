import React from 'react';
import PropTypes from 'prop-types';
import SplashScreen from './SplashScreen/SplashScreen';
import TokenLoader from './LoginLoader/LoginLoader';
import withMK from '../hoc/withMK';

class MusicKitAuthorizeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      browsing: false,
      ...MusicKitAuthorizeProvider.getDerivedStateFromProps(this.props, {}),
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      isAuthorized: props.mk.instance.isAuthorized,
    };
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
      await music.authorize();
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
  }

  render() {
    const { ready, isAuthorized } = this.state;

    if (!ready) {
      return <TokenLoader />;
    }

    if (!isAuthorized && !this.state.browsing) {
      return (
        <SplashScreen
          onClick={() => this.props.mk.instance.authorize()}
          onBrowse={() => this.setState({ browsing: true })}
        />
      );
    }

    return this.props.children;
  }
}

MusicKitAuthorizeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  mk: PropTypes.any.isRequired,
};

const bindings = {
  [MusicKit.Events.authorizationStatusDidChange]: 'authorizationStatus',
};

export default withMK(MusicKitAuthorizeProvider, bindings);
