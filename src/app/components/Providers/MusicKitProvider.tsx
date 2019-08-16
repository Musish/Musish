import React, { ReactNode } from 'react';
import translate from '../../utils/translations/Translations';
import Loader from '../Common/Loader/Loader';

interface MusicKitProviderProps {
  children: ReactNode;
}

interface MusicKitProviderState {
  ready: boolean;
}

export default class MusicKitProvider extends React.Component<
  MusicKitProviderProps,
  MusicKitProviderState
> {
  constructor(props: MusicKitProviderProps) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  public componentDidMount() {
    MusicKit.configure({
      developerToken: process.env.APPLE_TOKEN,
      app: {
        name: 'Musish',
        icon: 'https://raw.githubusercontent.com/Musish/Musish/assets/misc/authIcon.png',
        build: '1.0beta1',
        version: '1.0beta1',
      },
      bitrate: MusicKit.PlaybackBitrate.HIGH,
    });

    this.setLanguage(MusicKit.getInstance().storekit.storefrontCountryCode);

    const handler = (e: any) => {
      this.setLanguage(e.storefrontCountryCode);
    };

    MusicKit.getInstance().addEventListener(
      'storefrontCountryCodeDidChange',
      handler as () => void,
    );

    this.setState({
      ready: true,
    });
  }

  public setLanguage = (countryCode: string) => {
    translate.setLanguage(countryCode);
    this.forceUpdate();
  };

  public render() {
    if (!this.state.ready) {
      return <Loader />;
    }

    return this.props.children;
  }
}
