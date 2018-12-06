import React from 'react';

export default class Page extends React.Component {
  render() {
    return (
      <main id="main-content" className={this.props.className}>
        {this.props.children}
      </main>
    )
  }
}
