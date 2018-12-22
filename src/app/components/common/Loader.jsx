import React from 'react';
import classes from './Loader.scss';

export default function Loader() {
  return (
    <div className={classes.container}>
      <div className={classes.loadingAnimation}>
        <div>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
