import React from 'react';
import PropTypes from 'prop-types';
import styles from './PageTitle.scss';

export default function PageTitle(props) {
  return (
    <div className={styles.pageTitle}>
      {props.context && <span className={styles.contextHeading}>{props.context}</span>}
      {props.title && (<h1>{props.title}</h1>)}
    </div>
  );
}

PageTitle.propTypes = {
  context: PropTypes.any,
  title: PropTypes.any,
};

PageTitle.defaultProps = {
  context: null,
};
