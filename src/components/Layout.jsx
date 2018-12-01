import React, {Fragment} from 'react';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

export default class Layout extends React.Component {
  render() {
    return (
        <Fragment>
          <NavigationBar/>


          <div id="main-wrapper">
            <Sidebar/>
            <main id="main-content">
              <div>
                {this.props.children}
              </div>
            </main>
          </div>
        </Fragment>
    );
  }
}
