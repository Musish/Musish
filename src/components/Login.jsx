import React, {Component} from 'react';

import LoginScss from './Login.scss';

export default class Login extends Component {
  render() {
    return (
        <div className={LoginScss.buttonContainer}>
          <button type={"button"} onClick={this.props.onClick} className={LoginScss.button}>Login</button>
        </div>
    );
  }
}
