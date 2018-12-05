import React, {Component} from 'react';

import LoginScss from './Login.scss';

export default class Login extends Component {
  render() {
    return (
        <div className={LoginScss.loginContainer}>
          <h1 className={LoginScss.title}>Musi.sh</h1>
          <h5 className={LoginScss.subheading}>Just like <i className="fab fa-apple" /> Music... ish.</h5>
          <button type={"button"} onClick={this.props.onClick} className={LoginScss.button}>Connect to Apple</button>
        </div>
    );
  }
}
