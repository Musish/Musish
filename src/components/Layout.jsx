import React, {Fragment} from 'react';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

import LayoutScss from './Layout.scss'

export default class Layout extends React.Component {
  render() {
    return (
        <Fragment>
          <NavigationBar/>
          <Sidebar/>

          <main id="main-content">
            <div className={LayoutScss.mainContainer}>
              {this.props.children}
            </div>
          </main>
        </Fragment>
    );
  }
}
