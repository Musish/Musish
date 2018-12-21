import React from 'react';
import PropTypes from 'prop-types';
import Login from './Login/Login';
import TokenLoader from './LoginLoader/LoginLoader';

export default class MusicKitAuthorizeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      isLoggedIn: false,
    };
  }

  async handleTokenCheck() {
    const music = MusicKit.getInstance();

    if (!music.isAuthorized) {
      this.setState({
        ready: true,
      });
      return;
    }

    try {
      await music.api.library.songs({ limit: 1 });
      this.setState({
        ready: true,
        isLoggedIn: true,
      });
    } catch (e) {
      this.setState({
        ready: true,
        isLoggedIn: false,
      });
    }
  }

  componentDidMount() {
    this.handleTokenCheck();
  }

  async authorize() {
    const music = MusicKit.getInstance();
    await music.authorize();

    this.setState({
      isLoggedIn: true,
    });
  }

  render() {
    const { ready, isLoggedIn } = this.state;

    if (!ready) {
      return <TokenLoader />;
    }

    if (!isLoggedIn) {
      return <Login onClick={() => this.authorize()} />;
    }

    return this.props.children;
  }
}

MusicKitAuthorizeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
