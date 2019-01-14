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
      ready: true,
      browsing: false,
      isAuthorized: props.mk.instance.isAuthorized,
    };

    this.check = this.check.bind(this);
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

  componentDidMount() {
    MusicKit.getInstance().addEventListener(
      MusicKit.Events.authorizationStatusDidChange,
      this.check
    );
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
