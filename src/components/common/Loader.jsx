import React, {Component} from 'react';
import LoaderScss from "./Loader.scss";

export default class Loader extends Component {
  render() {
    return (
        <div className={LoaderScss.container}>
          <div className={LoaderScss.ldsRipple}>
            <div/>
            <div/>
          </div>
        </div>
    );
  }
}
