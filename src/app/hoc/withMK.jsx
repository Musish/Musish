import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export default function withMK(WrappedComponent, bindings = {}) {
  class Enhance extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};
      this.bindingFunctions = {};
    }

    async componentDidMount() {
      for (const event of Object.keys(bindings)) {
        const state = bindings[event];
        const handler = e => this.handleEvent(state, e);
        this.bindingFunctions[event] = handler;
        MusicKit.getInstance().addEventListener(event, handler);
      }
    }

    componentWillUnmount() {
      for (const event of Object.keys(bindings)) {
        MusicKit.getInstance().removeEventListener(event, this.bindingFunctions[event]);
        delete this.bindingFunctions[event];
      }
    }

    handleEvent = (v, event) => {
      this.setState({
        [v]: event,
      });
    };

    render() {
      const mk = {
        instance: MusicKit.getInstance(),
        ...this.state,
      };

      return <WrappedComponent mk={mk} {...this.props} />;
    }
  }

  hoistNonReactStatic(Enhance, WrappedComponent);

  return Enhance;
}
