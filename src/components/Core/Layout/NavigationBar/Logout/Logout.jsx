import React, {Component} from 'react';
import classes from './Logout.scss';
import withMK from '../../../../../hoc/withMK';

class Logout extends Component {

  constructor(props) {
    super(props);
  }

  logout() {
    this.props.mk.instance.unauthorize();
    window.location.reload();
  }

  render() {
    return(
      <div className={classes.logoutWrapper}>
          <span onClick={() => this.logout()}>Logout</span>
      </div>
    );
  }
}

export default withMK(Logout);
