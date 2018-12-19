import React, {Component} from 'react';
import classes from './RadioPage.scss';

export default class RadioPage extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {

    return (
      <div className={classes.container}>
        <span className={classes.comingSoon}>Coming Soon!</span>
      </div>
    );
  }
}
