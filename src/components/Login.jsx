import React, {Component} from 'react';

import LoginScss from './Login.scss';

export default class Login extends Component {
  render() {
    return (
        <div className={LoginScss.buttonContainer}>
          <h1 className={LoginScss.title}> Musi.sh</h1>
          <h5 className={LoginScss.subheading}>Please connect to start browsing through your music.</h5>
          <button type={"button"} onClick={this.props.onClick} className={LoginScss.button}>Connect to  Music</button>
        </div>
    );
  }
}
