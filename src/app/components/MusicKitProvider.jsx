import React from 'react';
import PropTypes from 'prop-types';
import Loader from './Common/Loader/Loader';

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
      return <Loader />;
    }

    return this.props.children;
  }
}

MusicKitProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
