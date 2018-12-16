import React, {Component} from 'react';
import classes from "./Loader.scss";

export default class Loader extends Component {
  render() {
    return (
        <div className={classes.container}>
          <div className={classes.spinner}>
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
            <div className={classes.spinnerBlade} />
          </div>
        </div>
    );
  }
}
