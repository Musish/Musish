import React, { Context } from 'react';

export default function withContext<P extends T, T extends object>(
  Component: React.ComponentType<P>,
  WrapperContext: Context<T>,
): React.ComponentType<Subtract<P, T>> {
  return function ContextComponent(props: P) {
    return (
      <WrapperContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </WrapperContext.Consumer>
    );
  };
}
