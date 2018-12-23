import React from 'react';
import classes from './SearchPage.scss';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={classes.container}>Search Result Page</div>;
  }
}
