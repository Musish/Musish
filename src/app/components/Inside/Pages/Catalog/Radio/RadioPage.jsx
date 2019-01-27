import React from 'react';
import classes from './RadioPage.scss';
import translate from '../../../../../utils/translations/Translations';

export default function RadioPage() {
  return (
    <div className={classes.radioContainer}>
      <div className={classes.comingSoonIcon}>
        <i className={'fas fa-broadcast-tower'} />
      </div>
      <span className={classes.comingSoon}>{translate.radioMessage}</span>
    </div>
  );
}
