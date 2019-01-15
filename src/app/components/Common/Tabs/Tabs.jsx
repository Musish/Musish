import React from 'react';
import { withRouter, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';

import cx from 'classnames';

import classes from './Tabs.scss';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };
  }

  render() {
    const { children, location } = this.props;
    const { tabIndex } = this.state;

    const tabs = React.Children.toArray(children);

    let selected = tabIndex;
    tabs.forEach((tab, index) => {
      const { route } = tab.props;
      if (route && matchPath(location.pathname, { path: route, exact: true })) {
        selected = index;
      }
    });

    return (
      <>
        <div className={classes.choices}>
          {tabs.map((tab, index) => {
            const { name: tabName, route: tabRoute } = tab.props;
            return (
              <div
                key={tabRoute || tabName}
                className={cx(classes.selectionItem, {
                  [classes.selected]: index === selected,
                })}
                onClick={() => {
                  if (tabRoute) {
                    this.props.history.push(tabRoute);
                  }
                  this.setState({ tabIndex: index });
                }}
              >
                {tabName}
              </div>
            );
          })}
        </div>
        {tabs[selected]}
      </>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  history: PropTypes.any.isRequired,
  location: PropTypes.any.isRequired,
};

export default withRouter(Tabs);
