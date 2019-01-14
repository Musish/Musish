import React from 'react';
import classes from './RadioPage.scss';

export default function RadioPage() {
  return (
    <div className={classes.radioContainer}>
      <div className={classes.comingSoonIcon}>
        <i className={'fas fa-broadcast-tower'} />
      </div>
      <span className={classes.comingSoon}>
        {"We're working on bringing Radio to you ASAP. Check back later."}
      </span>
    </div>
  );
}
