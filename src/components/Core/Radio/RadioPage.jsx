import React, {Component} from 'react';
import classes from './RadioPage.scss';

export default class RadioPage extends Component {

  render() {

    return (
      <div className={classes.container}>
        <span className={classes.comingSoon}>Coming Soon!</span>
      </div>
    );
  }
}
