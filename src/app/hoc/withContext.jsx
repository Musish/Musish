import React from 'react';

export default function withContext(Component, Context) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>{contexts => <Component {...props} {...contexts} />}</Context.Consumer>
    );
  };
}
