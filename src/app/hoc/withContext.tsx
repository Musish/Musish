import React, { Context } from 'react';

export default function withContext<P extends object, T extends any>(
  Component: React.ComponentType<P>,
  WrapperContext: Context<T>,
) {
  return function ContextComponent(props: P) {
    return (
      <WrapperContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </WrapperContext.Consumer>
    );
  };
}
