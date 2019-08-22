import React from 'react';
import classes from './Loader.scss';

const Loader: React.FC<{}> = () => {
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
};

export default Loader;
