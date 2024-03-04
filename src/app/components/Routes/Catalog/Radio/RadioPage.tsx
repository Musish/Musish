import React from 'react';
import translate from '../../../../utils/translations/Translations';
import classes from './RadioPage.scss';
import Link from "next/link"
const RadioPage: React.FC<{}> = () => {
  return (
    <div className={classes.radioContainer}>
      <div className={classes.comingSoonIcon}>
        <i className={'fas fa-broadcast-tower'} />
      </div>
      <span className={classes.comingSoon}>{translate.radioMessage}</span>
      <Link href="https://www.apple.com/feedback/apple-music.html ">Feedback</Link>
    </div>
  );
};

export default RadioPage;
