import React from 'react';
import Loader from '../../Common/Loader/Loader';
import classes from './LoginLoader.scss';

const TokenLoader: React.FC<{}> = () => {
  return (
    <div className={classes.container}>
      <Loader />
    </div>
  );
};

export default TokenLoader;
