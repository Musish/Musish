import React from 'react';
import css from './PageContent.scss';

export default class PageContent extends React.Component {
  render() {
    return (
      <div className={css.pageContent} ref={this.props.innerRef}>
        {this.props.children}
      </div>
    )
  }
}
