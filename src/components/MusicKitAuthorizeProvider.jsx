import React from 'react';
import Login from './Login';

export default class MusicKitAuthorizeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  async authorize() {
    const music = MusicKit.getInstance();
    await music.authorize();

    this.setState({
      ready: true
    })
  }

  render() {
    if (!this.state.ready) {
      return <Login onClick={() => this.authorize()}/>;
    }

    return this.props.children;
  }
}
