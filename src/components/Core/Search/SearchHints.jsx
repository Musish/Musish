import React, {Component} from 'react';
import cx from 'classnames';

import classes from './SearchHints.scss';

export default class SearchHints extends Component {

  render() {
    return (
      <div className={cx(classes.searchContainer, this.props.classNames)}>Search Button</div>
    );
  }
}
