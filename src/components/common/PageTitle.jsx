import React from 'react';
import styles from './PageTitle.scss'

export default class PageTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.pageTitle}>
        {this.props.context && (
          <span className={styles.contextHeading}>{this.props.context}</span>
        )}
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}