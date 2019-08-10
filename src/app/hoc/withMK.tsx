import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import { Omit } from 'react-dnd';

export default function withMK<P extends IMKProps>(
  WrappedComponent: React.ComponentType<P>,
  bindings: { [k: string]: any } = {},
): React.ComponentClass<Omit<P, keyof IMKProps>> {
  interface IEnhanceProps {
    [k: string]: any;
  }
  class Enhance extends React.Component<P, IEnhanceProps> {
    private readonly bindingFunctions: { [k: string]: () => any } = {};

    constructor(props: P) {
      super(props);

      this.state = {};
    }

    public async componentDidMount() {
      for (const event of Object.keys(bindings)) {
        const state = bindings[event];
        const handler = (e: any) => this.handleEvent(state, e);
        // @ts-ignore
        this.bindingFunctions[event] = handler;
        // @ts-ignore
        MusicKit.getInstance().addEventListener(event, handler);
      }
    }

    public componentWillUnmount() {
      for (const event of Object.keys(bindings)) {
        MusicKit.getInstance().removeEventListener(event, this.bindingFunctions[event]);
        delete this.bindingFunctions[event];
      }
    }

    public handleEvent = (v: string, event: any) => {
      this.setState({
        [v]: event,
      });
    };

    public render() {
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
