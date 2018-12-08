import React from 'react';
import Loader from './common/Loader';

export default class MusicKitProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    MusicKit.configure({
      developerToken: process.env.JWT_TOKEN,
      app: {
        name: 'Musi.sh',
        build: '0.03a',
      },
    });

    this.setState({
      ready: true,
    });
  }

  render() {
    if (!this.state.ready) {
      return <Loader/>
    }

    return this.props.children;
  }
}
