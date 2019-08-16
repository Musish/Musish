import React, { ReactNode } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import withMK from '../../hoc/withMK';
import TokenLoader from '../Routes/LoginLoader/LoginLoader';
import SplashScreen from '../Routes/SplashScreen/SplashScreen';

export const AuthorizeContext = React.createContext({ authorized: false });

interface AuthorizeProviderProps extends MKProps, RouteComponentProps {
  children: ReactNode;
}

interface AuthorizeProviderState {
  ready: boolean;
  browsing: boolean;
  isAuthorized: boolean;
}

class AuthorizeProvider extends React.Component<AuthorizeProviderProps, AuthorizeProviderState> {
  constructor(props: AuthorizeProviderProps) {
    super(props);

    const allowDirectBrowse = /^\/(?!(me|$)).*$/i.test(props.location.pathname);

    this.state = {
      ready: false,
      browsing: allowDirectBrowse,
      isAuthorized: props.mk.instance.isAuthorized,
    };
  }

  public componentDidMount() {
    this.handleTokenCheck();

    const handler = this.check as () => void; // Required type casting to satisfy the event listener type
    MusicKit.getInstance().addEventListener(MusicKit.Events.authorizationStatusDidChange, handler);
  }

  public check = ({ authorizationStatus }: { authorizationStatus: number }) => {
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

  public handleTokenCheck = async () => {
    const music = this.props.mk.instance;

    if (!this.state.isAuthorized) {
      this.setState({
        ready: true,
      });
      return;
    }

    try {
      // ¯\_(ツ)_/¯ I have no clue why this works like that but it works soooo...
      // @ts-ignore: expect (ids: string[] | null, parameters?: QueryParameters)
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

  public render() {
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

export default withRouter(withMK(AuthorizeProvider));
