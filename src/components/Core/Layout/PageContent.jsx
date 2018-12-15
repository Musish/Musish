import React from 'react';
import css from './PageContent.scss';

export default class PageContent extends React.Component {
  render() {
    return (
      <div className={css.pageContent}>
        {this.props.children}
      </div>
    )
  }
}
