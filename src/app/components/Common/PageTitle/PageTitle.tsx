import * as React from 'react';
import * as styles from './PageTitle.scss';

export default function PageTitle({
  context,
  title,
}: {
  context: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <div className={styles.pageTitle}>
      {context && <span className={styles.contextHeading}>{context}</span>}
      {title && <h1>{title}</h1>}
    </div>
  );
}
