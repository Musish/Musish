import React, {Fragment} from 'react';
import NavigationBar from "./NavigationBar";

export default class Layout extends React.Component {
  render() {
    return (
      <Fragment>
        <NavigationBar/>
        

        <main id="main-content">
          { this.props.children }
        </main>
      </Fragment>
    );
  }
}
