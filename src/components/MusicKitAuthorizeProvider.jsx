import React from 'react';
import PropTypes from 'prop-types';
import Login from './Login/Login';
import TokenLoader from './LoginLoader/LoginLoader';
import withMK from '../hoc/withMK';

class MusicKitAuthorizeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
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

    console.log("1: " + this.state.isAuthorized);

    if (!this.state.isAuthorized) {
      console.log("1.1: I am not authorized: " + this.state.isAuthorized);

      this.setState({
        ready: true,
      });
      return;
    }

    console.log("2: " + this.state.isAuthorized);


    try {
      await music.api.library.songs({ limit: 0 });
      await music.authorize();
      console.log("3: " + this.state.isAuthorized);

    } catch (e) {
      await music.unauthorize();
      console.log("4: " + this.state.isAuthorized);

    }

    this.setState({
      ready: true,
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

    if (!isAuthorized) {
      return <Login onClick={() => this.props.mk.instance.authorize()}/>;
    }

    return this.props.children;
  }
}

MusicKitAuthorizeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const bindings = {
  [MusicKit.Events.authorizationStatusDidChange]: 'authorizationStatus',
};

export default withMK(MusicKitAuthorizeProvider, bindings);
