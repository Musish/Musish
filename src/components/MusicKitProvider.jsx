import React from 'react';

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
        name: 'Apple Musish',
        build: '0.01a',
      },
    });

    this.setState({
      ready: true,
    });
  }

  render() {
    if (!this.state.ready) {
      return 'Loading...';
    }

    return this.props.children;
  }
}