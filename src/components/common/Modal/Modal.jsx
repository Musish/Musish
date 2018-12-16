import React, {Component} from 'react';
import classes from "./Modal.scss";

export default class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    }
  }

  render() {
    if(!this.state.show) {
      return null;
    }

    return (
      <div className={classes.container}>
        <div className={classes.modal}>
          {this.props.render()}
        </div>
      </div>
    );
  }
}
