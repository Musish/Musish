import React, {Component} from 'react';
import classes from "./Loader.scss";

export default class Loader extends Component {
  render() {
    return (
      <div className={classes.container}>
        <div className={classes.loadingAnimation}>
          <div><span/><span/><span/><span/><span/></div>
        </div>
      </div>
    );
  }
}
