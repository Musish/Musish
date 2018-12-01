import React, {Fragment} from 'react';
import NavigationBar from "./NavigationBar";
import Sidebar from "./Sidebar";

export default class Layout extends React.Component {
  render() {
    return (
      <Fragment>
        <NavigationBar/>
        <Sidebar />

        <main id="main-content">
          { this.props.children }
        </main>
      </Fragment>
    );
  }
}
