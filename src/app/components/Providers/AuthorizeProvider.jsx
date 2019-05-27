import React from 'react';
import PropTypes from 'prop-types';
import SplashScreen from '../Routes/SplashScreen/SplashScreen';
import TokenLoader from '../Routes/LoginLoader/LoginLoader';
import withMK from '../../hoc/withMK';
import { withRouter } from 'react-router-dom';

export const AuthorizeContext = React.createContext({ authorized: false });

class AuthorizeProvider extends React.Component {
  constructor(props) {
    super(props);

    const allowDirectBrowse = /^\/(?!me).*$/i.test(props.location.pathname);

    this.state = {
      ready: false,
      browsing: allowDirectBrowse,
      isAuthorized: props.mk.instance.isAuthorized,
    };
  }

  componentDidMount() {
    this.handleTokenCheck();

    MusicKit.getInstance().addEventListener(
      MusicKit.Events.authorizationStatusDidChange,
      this.check
    );
  }

  check = ({ authorizationStatus }) => {
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
  };

  handleTokenCheck = async () => {
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
  };

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

AuthorizeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  mk: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(withMK(AuthorizeProvider));
