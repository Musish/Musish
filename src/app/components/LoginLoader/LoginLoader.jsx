import React from 'react';
import Loader from '../common/Loader';
import classes from './LoginLoader.scss';

export default function TokenLoader() {
  return (
    <div className={classes.container}>
      <Loader />
    </div>
  );
}
