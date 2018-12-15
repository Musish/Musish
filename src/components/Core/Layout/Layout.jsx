import React, {Fragment} from 'react';
import NavigationBar from './NavigationBar/NavigationBar';
import Sidebar from './Sidebar/Sidebar';

export default class Layout extends React.Component {
  render() {
    return (
        <Fragment>
          <NavigationBar/>

          <div id="main-wrapper">
            <Sidebar/>
            <main id="main-content" className={this.props.className}>
              {this.props.children}
            </main>
          </div>
        </Fragment>
    );
  }
}
